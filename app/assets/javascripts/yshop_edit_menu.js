/* ################################################################################################### */
function shop_Raw2Json_cateTitle(lineIndex,lineContent) {
//# 台式
    if($.trim(lineContent).length==0) {
        gErrMsg=String.format("Line[{0}] is '{1}' but content is empty or blank.",lineIndex, "cateTitle");
        console.warn(gErrMsg);
        return null;
    }
    return $.trim(lineContent);
}

function shop_Raw2Json_dishTitle(lineIndex,lineContent) {
//古早便當 $75
//老K奶蓋綠 $40, "特價"
    var dishTitle={name:null,bprice:0};

    if($.trim(lineContent).length==0) {
        gErrMsg=String.format("Line[{0}] is '{1}' but content is empty or blank.",lineIndex, "dishTitle");
        console.warn(gErrMsg);
        return null;
    }
    
    //Keys[','] can not appear or max appear only once,
    var lineSeqs = $.trim(lineContent).split(',');
    if((lineSeqs.length-1)>1) {
        gErrMsg=String.format("Line[{0}] is '{1}' but too many ','.",lineIndex, "dishTitle");
        console.warn(gErrMsg);
        return null;
    }
    else if((lineSeqs.length-1)==1) {
        if($.trim(lineSeqs[1]).length==0) {
            gErrMsg=String.format("Line[{0}] is '{1}' but content is empty or blank after ','.",lineIndex, "dishTitle");
            console.warn(gErrMsg);
            return null;
        }
        dishTitle['capword']=$.trim(lineSeqs[1]);
    }

    var rawTitle = $.trim(lineSeqs[0]).split('$');
    if((rawTitle.length-1)!=1) {
        gErrMsg=String.format("Line[{0}] is '{1}' but none or too many '$'.",lineIndex, "dishTitle");
        console.warn(gErrMsg);
        return null;
    }

    dishTitle.name = $.trim(rawTitle[0]);
    if(dishTitle.name.length==0) {
        gErrMsg=String.format("Line[{0}] is '{1}' but name is empty or blank before '$'.",lineIndex, "dishTitle");
        console.warn(gErrMsg);
        return null;
    }

    dishTitle.bprice = parseInt($.trim(rawTitle[1]), 10);
    if(isNaN($.trim(rawTitle[1])) || isNaN(dishTitle.bprice)) {
        gErrMsg=String.format("Line[{0}] is '{1}' but after '$' not price number.",lineIndex, "dishTitle");
        console.warn(gErrMsg);
        return null;
    }
    
    return dishTitle;
}

function shop_Raw2Json_question(lineIndex,lineContent,cType) {
//?主食: *白飯, 麵條
//?容量!:  小杯 $35, *中杯 $40, 大杯 $45
//?甜度: 無糖, 3分糖, 半糖, 7分糖, *正常
//?冰塊: 去冰, 少冰, *正常
//+加料: 珍珠 $5, 蒟篛 $5, 紅豆 $5, 綠豆 $5, *黑糖水
    var question={desc:'',type:cType,highlight:false,options:[]};

    if($.trim(lineContent).length==0) {
        gErrMsg=String.format("Line[{0}] is '{1}' but content is empty or blank.",lineIndex, "question");
        console.warn(gErrMsg);
        return null;
    }

    //Keys[':'] must appear and max appear only once,
    var lineSeqs = $.trim(lineContent).split(':');
    if((lineSeqs.length-1)!=1) {
        gErrMsg=String.format("Line[{0}] is '{1}' but none or too many ':'.",lineIndex, "question");
        console.warn(gErrMsg);
        return null;
    }

    var rawTitle = $.trim(lineSeqs[0]);
    var rawOpts = $.trim(lineSeqs[1]).split(',');
    
    //Check title
    question.highlight=(rawTitle[rawTitle.length-1]=='!')?true:false;
    var sub_len=(question.highlight)?rawTitle.length-1:rawTitle.length;
    question.desc=$.trim( rawTitle.substr(0,sub_len) );
    if(question.desc.length==0) {
        gErrMsg=String.format("Line[{0}] is '{1}' but desc is empty or blank.",lineIndex, "question");
        console.warn(gErrMsg);
        return null;
    }

    //Check options
    if( rawOpts.length-1<1 ) {
        gErrMsg=String.format("Line[{0}] is '{1}' but options is empty or blank.",lineIndex, "question");
        console.warn(gErrMsg);
        return null;
    }

    var defaultOpt_Cnt=0;
    for(var i=0; i<rawOpts.length; i++) {
		var rawOpt = $.trim(rawOpts[i]);
        var opt={desc:null};
        if(rawOpt.length==0) {
            gErrMsg=String.format("Line[{0}] is '{1}' but options[%d] is empty or blank.",lineIndex, "question",i);
            console.warn(gErrMsg);
            return null;
        }
        var rawOptSeqs = $.trim(rawOpt).split('$');
        //console.log('rawTitle.length',rawTitle.length);
        if((rawOptSeqs.length-1)>1) {
            gErrMsg=String.format("Line[{0}] is '{1}' but options[%d] has too much '$'.",lineIndex, "question",i);
            console.warn(gErrMsg);
            return null;
        }
        else if((rawOptSeqs.length-1)==1) {            
            var price = parseInt($.trim(rawOptSeqs[1]), 10);
            if(isNaN($.trim(rawOptSeqs[1])) || isNaN(price)) {
                gErrMsg=String.format("Line[{0}] is '{1}' but options[%d] after '$' not price number.",lineIndex, "question",i);
                console.warn(gErrMsg);
                return null;
            }
            if(price!=0)
                opt['price']=price;
        }

        var rawOptTitle = $.trim(rawOptSeqs[0]);
        if(rawOptTitle[0]=='*') {
            defaultOpt_Cnt+=1;
            if( question.type=='choice' && defaultOpt_Cnt>1) {
                gErrMsg=String.format("Line[{0}] is '{1}' but there are two default options in choice.",lineIndex, "question");
                console.warn(gErrMsg);
                return null;
            }
            opt['default']=true;
        }

        var sub_start=(opt.default!=null)?1:0;
        var sub_len=(opt.default!=null)?rawOptTitle.length-1:rawOptTitle.length;
        opt.desc=$.trim( rawOptTitle.substr(sub_start,sub_len) );
        if(opt.desc.length==0) {
            gErrMsg=String.format("Line[{0}] is '{1}' but options[%d] desc is empty or blank.",lineIndex, "question",i);
            console.warn(gErrMsg);
            return null;
        }

        question.options.push(opt);
	}

    if( question.type=='choice' && defaultOpt_Cnt==0 ) {
        gErrMsg=String.format("Line[{0}] is '{1}' but no default option.",lineIndex, "question,choice");
        console.warn(gErrMsg);
        return null;
    }
    
    return question;
}

function shop_Raw2Json_menu(rawData) {
    var menu={'rawData':rawData};

    //For removing only beginning and trailing white-space
    if($.trim(rawData).length==0) {
        gErrMsg=String.format("input is empty or blank.");
        console.warn(gErrMsg);
        return null;
    }

    //Keys['\n'] can not appear or max appear only once,
    var rawLines = $.trim(rawData).split('\n');
    //console.log('rawLines.length=',rawLines.length);
    
    for(var i=0; i<rawLines.length; i++) {
        if($.trim(rawLines[i]).length==0)
            continue;
        var rawLine=$.trim(rawLines[i]);
        var lineType=(rawLine[0]=='#')?"cateTitle":(( rawLine[0]=='?' || rawLine[0]=='+' )?"question":"dishTitle");
        if(menu.cateBlocks==null && menu.dishes==null) {
            //First Line to check the menu has category or not
            if(lineType=="cateTitle")
                menu['cateBlocks']=[];
            else if(lineType=="dishTitle")
                menu['dishes']=[];
            else {
                gErrMsg=String.format("Line[{0}] is '{1}' but first line need to be cateTitle or dishTitle.",i, lineType);
                console.warn(gErrMsg);
                return null;
            }
        }
        var sub_start=(lineType=="dishTitle")?0:1;
        var sub_len=(lineType=="dishTitle")?rawLine.length:rawLine.length-1;
        var lineContent=$.trim(rawLine.substr(sub_start,sub_len));
        //console.log('rawLine.length=%d,type=%s,sub_start=%d,sub_len=%d,lineContent=%s',
        //    rawLine.length,lineType,sub_start,sub_len,lineContent);

        if(lineType=="cateTitle") {
            if(menu.cateBlocks==null) {
                gErrMsg=String.format("Line[{0}] is '{1}' but first line is not.",i, lineType);
                console.warn(gErrMsg);
                return null;
            }
            var cateBlock={name:null,dishes:[]};
            if( (cateBlock.name=shop_Raw2Json_cateTitle(i,lineContent))==null )
                return null;
            menu.cateBlocks.push(cateBlock);
        }
        else if(lineType=="dishTitle") {
            var dishBlock=shop_Raw2Json_dishTitle(i,lineContent);
            if( dishBlock==null )
                return null;
            if(menu.cateBlocks)
                menu.cateBlocks[menu.cateBlocks.length-1].dishes.push(dishBlock);
            else if(menu.dishes)
                menu.dishes.push(dishBlock);
        }
        else if(lineType=="question") {
            var cType=(rawLine[0]=='+')?"extra":"choice";
            var question=shop_Raw2Json_question(i,lineContent,cType);
            if( question==null )
                return null;
            var last_dishBlock=null;
            if(menu.cateBlocks) {
                var last_cateBlock=menu.cateBlocks[menu.cateBlocks.length-1];
                if(last_cateBlock.dishes.length==0) {
                    gErrMsg=String.format("Line[{0}] is '{1}' but not in dish.",i, lineType);
                    console.warn(gErrMsg);
                    return null;
                }
                last_dishBlock=last_cateBlock.dishes[last_cateBlock.dishes.length-1];
            }
            else {
                if(menu.dishes.length==0) {
                    gErrMsg=String.format("Line[{0}] is '{1}' but not in dish.",i, lineType);
                    console.warn(gErrMsg);
                    return null;
                }
                last_dishBlock=menu.dishes[menu.dishes.length-1];
            }

            //spec
            if(last_dishBlock['customspec']==null)
                last_dishBlock['customspec']={questions:[]};//{highlight_idx:0, showsum_idx:0, questions:[]}
            if(question.highlight==true) {                
                if(last_dishBlock.customspec.highlight_idx!=null) {
                    gErrMsg=String.format("Line[{0}] is '{1}' but two questions have highlight '!'.",i, lineType);
                    console.warn(gErrMsg);
                    return null;
                }
                last_dishBlock.customspec['highlight_idx']=last_dishBlock.customspec.questions.length;
            }
            delete question["highlight"];

            for(var j=0; j<question.options.length; j++) {
                if(question.options[j].price!=last_dishBlock.bprice)
                    continue;
                if(last_dishBlock.customspec.showsum_idx!=null) {
                    gErrMsg=String.format("Line[{0}] is '{1}' but there are two questions its option price is same as dish bprice.",i, lineType);
                    console.warn(gErrMsg);
                    return null;
                }
                last_dishBlock.customspec['showsum_idx']=last_dishBlock.customspec.questions.length;
            }            
            last_dishBlock.customspec.questions.push(question);
        }
        //console.log("Line[%d] is '%s' OK.",i, lineType);
    }
    
    //console.log(JSON.stringify(menu));
    //console.log(menu);
    return menu;
}

/* ################################################################################################### */
function shop_Json2Raw_menu(menu) {
    var rawData = String.format("");
    if(menu.cates!=null) {
        for(var i=0;i<menu.cates.length;i++) {
            rawData+= shop_Json2Raw_cate(menu.cates[i]);
        }
    }
    return rawData;
}

function shop_Json2Raw_cate(cate) {
    var rawData = String.format("#{0}\n",cate.name);
    if(cate.dishes!=null) {
        for(var i=0;i<cate.dishes.length;i++) {
            rawData+= shop_Json2Raw_dish(cate.dishes[i]);
        }
    }
    return rawData;
}

function shop_Json2Raw_dish(dish) {
//老K奶蓋綠 $40, "特價"
    var newDishName=dish.name+" $"+dish.bprice;
    if(dish.capword!=null)
        newDishName+=" ,"+dish.capword;
    var rawData = String.format("{0}\n",newDishName);

    if(dish.customspec!=null) {
        for(var i=0;i<dish.customspec.questions.length;i++) {
            var highlight=(i==dish.customspec.highlight_idx)?true:false;
            rawData+= shop_Json2Raw_question(dish.customspec.questions[i],highlight);
        }
    }
    
    return rawData;
}

function shop_Json2Raw_question(question,highlight) {
//   ?容量!:  小杯 $35, *中杯 $40, 大杯 $45
    var rawData = String.format("{0}{1}{2}: ",
                    (question.type=="choice")?'?':'+',
                    question.desc,
                    (highlight==true)?'!':'');
    for(var i=0;i<question.options.length;i++) {
        rawData+= String.format("{0}{1} {2}{3}",
                    (question.options[i].default==null||question.options[i].default==false)?'':'*',
                    question.options[i].desc,
                    (question.options[i].price==null)?'':"$"+question.options[i].price,
                    (i!=question.options.length-1)?',':'');
    }
    rawData+="\n";
    return rawData;
}

/* ################################################################################################### */
function shop_Json2Ui_cateTitle(cateIdx,cate) {
//<li class='cateTitle' cate_id='59777'>
//    <a href='#' rel='cateName'>咖哩系列</a>
//    <a href='#' rel='cateDelete' class='btn small cateDelete danger'>刪除</a>
//    <a href='#' rel='dishCreate' class='btn small dishCreate primary'>新增商品</a>
//</li>
    var UIque = String.format("<li class='cateTitle' cate_id='{0}'>",cate.id);
        UIque+= String.format("<a href='#' rel='cateName'>{0}</a>",cate.name);
        UIque+= String.format("<a href='#' rel='cateDelete' class='btn small cateDelete danger'>刪除</a>");
        UIque+= String.format("<a href='#' rel='dishCreate' class='btn small dishCreate primary'>新增商品</a>");
        UIque+= String.format("</li>");
    return UIque;
}

function shop_Json2Ui_cateContent(cateIdx,cate) {
//<li class='cateContent' cate_id='588000'>
//    <ul class='unstyled'>
//    </ul>
//</li>
    var newDish={id:'new',name:'新商品', bprice:100};
    var UIque = String.format("<li class='cateContent' cate_id='{0}'>",cateIdx);
        UIque+= String.format("<ul class='unstyled'>");
        //new dish edit
        UIque+= shop_Json2Ui_dishEditContent(cateIdx,newDish);

        //dishs
        if(cate.dishes!=null) {
            for(var i=0;i<cate.dishes.length;i++) {
                var dish=cate.dishes[i];
                UIque+= shop_Json2Ui_dishTitle(dish);
                UIque+= shop_Json2Ui_dishContent(dish);
                UIque+= shop_Json2Ui_dishEditContent(cateIdx,dish);
            }
        }

        UIque+= String.format("</ul>");
        UIque+= String.format("</li>");

    return UIque;
}

function shop_Json2Ui_cateEditContent(cateIdx,cate) {
}

function shop_Json2Ui_dishTitle(dish) {
//<li class='dishTitle' dish_id='574483'>
//    <a href='#' rel='dishName'>咖哩牛排飯</a>
//    <a href='#' rel='dishDelete' class='btn small dishDelete danger'>刪除</a>
//    <a href='#' rel='dishEdit' class='btn small dishEdit primary'>編輯</a>
//</li>
    var newDishName=dish.name+" $"+dish.bprice;
    if(dish.capword!=null)
        newDishName+=" ,"+dish.capword;
    var UIque = String.format("<li class='dishTitle' dish_id='{0}'>",dish.id);
        UIque+= String.format("<a href='#' rel='dishName'>{0}</a>",newDishName);
        UIque+= String.format("<a href='#' rel='dishDelete' class='btn small dishDelete danger'>刪除</a>");
        UIque+= String.format("<a href='#' rel='dishEdit' class='btn small dishEdit primary'>編輯</a>");
        UIque+= String.format("</li>");
    return UIque;
}

function shop_Json2Ui_dishContent(dish) {
//<li class='dishContent' dish_id='574483'>
//    <ul class='row clearfix unstyled'>
//        <li class='dishImg'>
//            <img src='http://a1.twimg.com/profile_images/809040483/twitterProfilePhoto_reasonably_small.jpg'>
//        </li>                                
//    </ul>
//</li>
    var UIque = String.format("<li class='dishContent' dish_id='{0}'>",dish.id);
        UIque+= String.format("<ul class='row clearfix unstyled'>");
        UIque+= String.format("<li class='dishImg'>");
        UIque+= String.format("<img src='http://a1.twimg.com/profile_images/809040483/twitterProfilePhoto_reasonably_small.jpg'>");
        UIque+= String.format("</li>");
        if(dish.customspec!=null) {
            for(var i=0;i<dish.customspec.questions.length;i++) {
                UIque+= shop_Json2Ui_question(dish.customspec.questions[i]);
            }
        }

        UIque+= String.format("</ul>");
        UIque+= String.format("</li>");

    return UIque;
}

function shop_Json2Ui_dishEditContent(cateIdx,dish) {
//<li class='dishEditContent' cate_id='59777' dish_id='new'>
//    <div class='input editBox'>
//        <span class='error-block'>Error message here!!</span>
//        <textarea class='xxlarge editArea' name='editArea' rows='3'></textarea>
//        <span class='help-block'>新增商品</span>
//        <a href='#' class='btn small dishEditCancel'>取消</a>
//        <a href='#' class='btn small dishEditPrimary primary'>確定</a>
//    </div>
//</li>
    var rawLineCnt=(dish.customspec==null)?0:(dish.customspec.questions.length+1<3)?3:dish.customspec.questions.length+2;
    var newDishName=dish.name+" $"+dish.bprice;
    if(dish.capword!=null)
        newDishName+=" ,"+dish.capword;
    var UIque = String.format("<li class='dishEditContent' cate_id='{0}' dish_id='{1}'>",cateIdx,dish.id);
        UIque+= String.format("    <div class='input editBox'>");
        UIque+= String.format("        <span class='error-block'>Error message here!!</span>");
        UIque+= String.format("        <textarea class='xxlarge editArea' name='editArea' rows='{0}'></textarea>",rawLineCnt);
        UIque+= String.format("        <span class='help-block'>{0}</span>",(dish.id!='new')?'名稱不可更改':'新增商品');
        UIque+= String.format("        <a href='#' class='btn small dishEditCancel'>取消</a>");
        UIque+= String.format("        <a href='#' class='btn small dishEditPrimary primary'>確定</a>");
        UIque+= String.format("    </div>");
        UIque+= String.format("</li>");

    return UIque;
}

function shop_Json2Ui_question(question) {
//{"desc":"容量","type":"choice","options":[{"desc":"小杯","price":35},{"desc":"中杯","price":40,"default":true},{"desc":"大杯","price":45}]}
    var UIque = String.format("<li class='dishQuestion'><strong>{0}:</strong>",question.desc);
    for(var i=0;i<question.options.length;i++) {
        if(question.options[i].price==null) {
            UIque+= String.format("<input type='{0}' {1} name='{2}' value='{3}'>{4}",
                            (question.type=="choice")?"radio":"checkbox",
                            (question.options[i].default!=null && question.options[i].default==true)?"checked":"",
                            question.desc,question.options[i].desc,question.options[i].desc);
        }
        else {
            UIque+= String.format("<input type='{0}' {1} name='{2}' value='{3}' price={4}>{5}: ${6}",
                            (question.type=="choice")?"radio":"checkbox",
                            (question.options[i].default!=null && question.options[i].default==true)?"checked":"",
                            question.desc,
                            question.options[i].desc,question.options[i].price,
                            question.options[i].desc,question.options[i].price);
        }
    }
    UIque+="</li>";
    return UIque;
}
    
/* ################################################################################################### */
function shop_DishUpdateByEdit(dish) {
    var newDishName=dish.name+" $"+dish.bprice;
    if(dish.capword!=null)
        newDishName+=" ,"+dish.capword;
    var dishTitle=$("li.dishTitle[dish_id="+dish.id+"]");
    var dishContent=$("li.dishContent[dish_id="+dish.id+"]");
    //console.log("dish=",dish);
    dishTitle.children("a[rel=dishName]").text(newDishName);

    dishContent.children("ul").children("li.dishQuestion").remove();
    if(dish.customspec!=null) {
        for(var i=0;i<dish.customspec.questions.length;i++) {
            dishContent.children("ul").append(shop_Json2Ui_question(dish.customspec.questions[i]));
        }
    }
}

function shop_DishCreateByEdit(cateIdx,dish) {
    //console.log("cateIdx=",cateIdx,dish);
    
    var UIque = shop_Json2Ui_dishTitle(dish);
        UIque+= shop_Json2Ui_dishContent(dish);
        UIque+= shop_Json2Ui_dishEditContent(cateIdx,dish);

    //console.log("UIque=",UIque);
    var cateContent=$("li.cateContent[cate_id="+cateIdx+"]");
    //console.log("cateContent=",cateContent);
    cateContent.children("ul").append(UIque);
    
    //console.log("new dish",dish,UIque);
    return UIque;
}

function shop_CateCreateByEdit(cate) {
    console.log("new cate.id=",cate.id,cate);
    
    var UIque = shop_Json2Ui_cateTitle(cate.id,cate);
        UIque+= shop_Json2Ui_cateContent(cate.id,cate);
    //console.log("UIque=",UIque);
    
    $("div.shopMenu_col").children("ul").append(UIque);
    
    return UIque;
}

function shop_MenuCreateByEdit(cateBlocks) {
    //console.log("new cateBlocks",cateBlocks);

    for(var i=0;i<cateBlocks.length;i++) {
        console.log("i=",i," id=",cateBlocks[i].id);
        shop_CateCreateByEdit(cateBlocks[i]);
        //console.log("i=",i," UIque=",UIque);
    }
}

function shop_MenuInit(shopdata) {
    if(shopdata.cates==null || shopdata.cates.length==0) {
        $(".cateCreate:visible").fadeOut('fast');
        $(".menuCreate:hidden").trigger('click');
    }
    else {
        for(var i=0;i<shopdata.cates.length;i++) {
            var cate=shopdata.cates[i];
            shop_CateCreateByEdit(cate);
            //console.log("i=",i," UIque=",UIque);
        }
    }
    
}

/* ################################################################################################### */
function shop_getCate(shopdata,cateIdx) {
    console.log("shop_getCate=",cateIdx);
    if(shopdata.cates!=null) {
        for(var i=0;i<shopdata.cates.length;i++) {
            if(shopdata.cates[i].id==cateIdx)
                return shopdata.cates[i];
        }
    }
    console.log("null,shop_getCate=",cateIdx);
    return null; 
}

function shop_getDish(shopdata,cateIdx,dishIdx) {
    //console.log(String.format("cateIdx={0},dishIdx={1} search.",cateIdx,dishIdx));
    if(shopdata.cates!=null) {
        for(var i=0;i<shopdata.cates.length;i++) {
            if(shopdata.cates[i].id!=cateIdx)
                continue;
            if(shopdata.cates[i].dishes!=null) {
                for(var j=0;j<shopdata.cates[i].dishes.length;j++) {
                    if(shopdata.cates[i].dishes[j].id==dishIdx)
                        return shopdata.cates[i].dishes[j];
                }
            }
        }
    }
    //console.log(String.format("cateIdx={0},dishIdx={1} is not exist.",cateIdx,dishIdx));
    
    return null; 
}

function shop_setDish(shopdata,dish) {
    if(shopdata.cates!=null) {
        for(var i=0;i<shopdata.cates.length;i++) {
            if(shopdata.cates[i].dishes!=null) {
                for(var j=0;j<shopdata.cates[i].dishes.length;j++) {
                    if(shopdata.cates[i].dishes[j].id==dish.id)
                        shopdata.cates[i].dishes[j]=dish;
                }
            }
        }
    }
}

function shop_delCate(shopdata,cateIdx) {
    if(shopdata.cates!=null) {
        for(var i=0;i<shopdata.cates.length;i++) {
            if(shopdata.cates[i].id==cateIdx)
                delete shopdata.cates[i];
        }
    }
}

function shop_delDish(shopdata,dishIdx) {
    if(shopdata.cates!=null) {
        for(var i=0;i<shopdata.cates.length;i++) {
            if(shopdata.cates[i].dishes!=null) {
                for(var j=0;j<shopdata.cates[i].dishes.length;j++) {
                    if(shopdata.cates[i].dishes[j].id==dishIdx)
                        delete shopdata.cates[i].dishes[j];
                }
            }
        }
    }
}

function shop_isDuplicateCate(shopdata,cate) {
    if(shopdata.cates!=null) {
        for(var i=0;i<shopdata.cates.length;i++) {
            if(shopdata.cates[i].name==cate.name)
                return true;
        }
    }
    return false; 
}

function shop_isDuplicateDish(shopdata,dish) {
    //console.log(String.format("cateIdx={0},dishIdx={1} search.",cateIdx,dishIdx));
    if(shopdata.cates!=null) {
        for(var i=0;i<shopdata.cates.length;i++) {
            if(shopdata.cates[i].dishes!=null) {
                for(var j=0;j<shopdata.cates[i].dishes.length;j++) {
                    if(shopdata.cates[i].dishes[j].name==dish.name)
                        return true;
                }
            }
        }
    }
    //console.log(String.format("cateIdx={0},dishIdx={1} is not exist.",cateIdx,dishIdx));
    
    return false; 
}


/* ################################################################################################### */
function shop_edit_init(shopdata) {

    $("a[rel=cateName]").die("click");
    $("a[rel=cateName]").live("click",function(){
    	var cateIdx=$(this).parent().attr('cate_id');
    	var cateContent=$("li.cateContent[cate_id="+cateIdx+"]");
        (cateContent.is(":visible"))?cateContent.fadeOut("slow"):cateContent.fadeIn("slow");
    	return false;
    });
    
    $("a[rel=dishName]").die("click");
    $("a[rel=dishName]").live("click",function(){
    	var dishIdx=$(this).parent().attr('dish_id');
    	var dishContent=$("li.dishContent[dish_id="+dishIdx+"]");
        (dishContent.is(":visible"))?dishContent.fadeOut("slow"):dishContent.fadeIn("slow");
    	return false;
    });
    
    $(".menuCreate").die("click");
    $(".menuCreate").live("click",function(){
    	console.log("menuCreate");
    	$(this).fadeIn("slow").prop('disabled', true);
    	var menu={cates:[{id:"new",name:"新類別",dishes:[{name:"新商品",bprice:100}]}]};
    	var editContent=$("li.menuEditContent");
    	var editArea=editContent.children(".editBox").children("textarea");
    	editArea.val(shop_Json2Raw_menu(menu));
    	editContent.fadeIn("slow");
    	return false;
    });
    
    $(".cateCreate").die("click");
    $(".cateCreate").live("click",function(){
    	console.log("cateCreate");
    	var cate={id:"new",name:"新類別",dishes:[{name:"新商品",bprice:100}]};
    	var editContent=$("li.cateEditContent[cate_id="+cate.id+"]");
    	var editArea=editContent.children(".editBox").children("textarea");
    	editArea.val(shop_Json2Raw_cate(cate));
    	editContent.fadeIn("slow");
    	return false;
    });
    
    $("a.cateDelete").die("click");
    $("a.cateDelete").live("click",function(){
    	console.log("cateDelete");
    	var cateIdx=$(this).parent().attr('cate_id');
        var urlReq=String.format("/api/shops/{0}/cates/{1}",shopdata.id,cateIdx);
        $.ajax( {
            type: "DELETE",
            url: urlReq,
            async: false,
            complete: function(response, status) {
                if (status == 'success') {
                    shop_delCate(shopdata,cateIdx);
    	            var cateTitle=$("li.cateTitle[cate_id="+cateIdx+"]");
    	            var cateContent=$("li.cateContent[cate_id="+cateIdx+"]");
    	            cateTitle.fadeOut("slow").remove();
    	            cateContent.fadeOut("slow").remove();
    	            console.log("li.cateTitle length=",$("li.cateTitle").length);
    	            if($("li.cateTitle").length==0) {
    	                console.log("li.cateTitle length=enter!!!");
    	                $(".menuCreate:hidden").trigger('click');
    	                console.log("li.cateTitle length=out!!!");
    	            }
                }
                else
                    console.log('Error: the service responded with: ' + response.status + '\n' + response.responseText)
            }
        });
    	return false;
    });
    
    $("a.dishCreate").die("click");
    $("a.dishCreate").live("click",function(){
    	var cateIdx=$(this).parent(".cateTitle").attr('cate_id');
    	var dish={id:"new",name:"新商品",bprice:100};
    	var cateContent=$("li.cateContent[cate_id="+cateIdx+"]");
        if(cateContent.is(":hidden")) 
            cateContent.fadeIn("slow");
    	var editContent=$("li.dishEditContent[cate_id="+cateIdx+"][dish_id="+dish.id+"]");
    	var editArea=editContent.children(".editBox").children("textarea");
        editArea.val(shop_Json2Raw_dish(dish));
    	editContent.fadeIn("slow");
    	return false;
    });
    
    $("a.dishEdit").die("click");
    $("a.dishEdit").live("click",function(){
    	//console.log("dishEdit");
    	var cateIdx=$(this).parent().parent().parent().attr('cate_id');
    	var dishIdx=$(this).parent().attr('dish_id');
    	var editContent=$("li.dishEditContent[dish_id="+dishIdx+"]");
    	var editArea=editContent.children(".editBox").children("textarea");
    	var dish=shop_getDish(shopdata,cateIdx,dishIdx);
    	editArea.val(shop_Json2Raw_dish(dish));
    	editContent.fadeIn("slow");
    	return false;
    });
    
    $("a.dishDelete").die("click");
    $("a.dishDelete").live("click",function(){
    	//console.log("dishDelete");
    	var cateIdx=$(this).parent().parent().parent().attr('cate_id');
    	var dishIdx=$(this).parent().attr('dish_id');
        var urlReq=String.format("/api/shops/{0}/cates/{1}/dishes/{2}",shopdata.id,cateIdx,dishIdx);
        $.ajax( {
            type: "DELETE",
            url: urlReq,
            async: false,
            complete: function(response, status) {
                if (status == 'success') {
                    shop_delDish(shopdata,dishIdx);
    	            var dishTitle=$("li.dishTitle[dish_id="+dishIdx+"]");
    	            var dishContent=$("li.dishContent[dish_id="+dishIdx+"]");
    	            var editContent=$("li.dishEditContent[dish_id="+dishIdx+"]");
    	            dishTitle.fadeOut("slow").remove();
    	            dishContent.fadeOut("slow").remove();
    	            editContent.fadeOut("slow").remove();
                }
                else
                    console.log('Error: the service responded with: ' + response.status + '\n' + response.responseText)
            }
        });

    	return false;
    });
    
    
    $("a.menuEditCancel").die("click");
    $("a.menuEditCancel").live("click",function(){
    	//console.log("menuEditCancel");
    	var editContent=$("li.menuEditContent");
    	var editArea=editContent.children(".editBox").children("textarea");
        editArea.val("");
        editContent.removeClass("errorEdit").fadeOut("slow");
    	$(this).siblings(".error-block").text("").fadeOut("slow");
    	return false;
    });
    
    $("a.cateEditCancel").die("click");
    $("a.cateEditCancel").live("click",function(){
    	//console.log("cateEditCancel");
    	var cateIdx=$(this).parent().parent(".cateEditContent").attr('cate_id');
    	var editContent=$("li.cateEditContent[cate_id="+cateIdx+"]");
    	var editArea=editContent.children(".editBox").children("textarea");
        editArea.val("");
        editContent.removeClass("errorEdit").fadeOut("slow");
    	$(this).siblings(".error-block").text("").fadeOut("slow");
    	return false;
    });
    
    $("a.dishEditCancel").die("click");
    $("a.dishEditCancel").live("click",function(){
    	//console.log("dishEditCancel");
    	var cateIdx=$(this).parent().parent(".dishEditContent").attr('cate_id');
    	var dishIdx=$(this).parent().parent(".dishEditContent").attr('dish_id');
    	var editContent=$("li.dishEditContent[cate_id="+cateIdx+"][dish_id="+dishIdx+"]");
    	var editArea=editContent.children(".editBox").children("textarea");
    	editArea.val("");
        editContent.removeClass("errorEdit").fadeOut("slow");
    	$(this).siblings(".error-block").text("").fadeOut("slow");
    	return false;
    });
    
    $("a.menuEditPrimary").die("click");
    $("a.menuEditPrimary").live("click",function(){
    	var editContent=$("li.menuEditContent");
    	var editArea=editContent.children(".editBox").children("textarea");
    	var rawCorrect=true;
    	var rawData=editArea.val();
    	console.log("menuEditPrimary: %s",rawData);
    	var resMenu=shop_Raw2Json_menu(rawData);
    	if(resMenu==null) {
            rawCorrect=false;
        } else if(resMenu.cateBlocks==null&&resMenu.dishes==null) {
            gErrMsg=String.format("Input is not cateTitle nor dishTitle.");
            rawCorrect=false;
        }
    
        if(rawCorrect==false) {
            editContent.addClass("errorEdit");
            $(this).siblings(".error-block").text(gErrMsg);
            $(this).siblings(".error-block").fadeIn("slow");
            return false;
        }
    
        editContent.removeClass("errorEdit");
    	$(this).siblings(".error-block").text("");
    	$(this).siblings(".error-block").fadeOut("slow");
    	editContent.fadeOut("slow");
        editContent.next("ul").fadeOut("slow");
    
        //modify success then update ui
        shopdata['cates']=[];
        for(var i=0;i<resMenu.cateBlocks.length;i++) {
            var newCate=resMenu.cateBlocks[i];
            var urlReq=String.format("/api/shops/{0}/cates/",shopdata.id);
            $.post(urlReq, {name:newCate.name},
                function(rtnData) {
                    newCate['id']=rtnData.OK.id;
                    var urlReq=String.format("/api/shops/{0}/cates/{1}/dishes/",shopdata.id,newCate.id);
                    if(newCate.dishes!=null) {
                        for(var j=0; j<newCate.dishes.length; j++) {
                            var dish=newCate.dishes[j];
                            $.post(urlReq, dish,
                                function(rtnData) {
                                    dish['id']=rtnData.OK.id;
                                }, "json");
                        }
                    }
                    shopdata.cates.push(newCate);
                    shop_CateCreateByEdit(newCate);
                }, "json");
        }

        $(".cateCreate:hidden").fadeIn('slow');
        $(".menuCreate:visible").fadeOut('slow');

        //console.log(JSON.stringify(resMenu));
    	return false;
    });
    
    $("a.cateEditPrimary").die("click");
    $("a.cateEditPrimary").live("click",function(){
    	var cateIdx=$(this).parent().parent(".cateEditContent").attr('cate_id');
    	var editContent=$("li.cateEditContent[cate_id="+cateIdx+"]");
    	var editArea=editContent.children(".editBox").children("textarea");
    	var rawCorrect=true;
    	var rawData=editArea.val();
    	console.log("cateEditPrimary: %s",rawData);
    	var resMenu=shop_Raw2Json_menu(rawData);
    	if(resMenu==null) {
            rawCorrect=false;
        } else if(resMenu.cateBlocks==null) {
            gErrMsg=String.format("Input is not cateTitle.");
            rawCorrect=false;
        } else if(resMenu.cateBlocks.length!=1) {
            gErrMsg=String.format("Input too many cateTitle");
            rawCorrect=false;
        }
    
        if(rawCorrect==false) {
            editContent.addClass("errorEdit");
            $(this).siblings(".error-block").text(gErrMsg);
            $(this).siblings(".error-block").fadeIn("slow");
            return false;
        }

        var newCate=resMenu.cateBlocks[0];
        console.log("newCate",newCate);
        if(cateIdx=='new' && shop_isDuplicateCate(shopdata,newCate)) {
            gErrMsg="商品名稱已重複";
            editContent.addClass("errorEdit");
            $(this).siblings(".error-block").text(gErrMsg);
            $(this).siblings(".error-block").fadeIn("slow");
            return false;
        }

        editContent.removeClass("errorEdit");
    	$(this).siblings(".error-block").text("");
    	$(this).siblings(".error-block").fadeOut("slow");
    	editContent.fadeOut("slow");
        editContent.next("ul").fadeOut("slow");
    
        //modify success then update ui
        var urlReq=String.format("/api/shops/{0}/cates/",shopdata.id);
        $.post(urlReq, {name:newCate.name},
            function(rtnData) {
                newCate['id']=rtnData.OK.id;
                var urlReq=String.format("/api/shops/{0}/cates/{1}/dishes/",shopdata.id,newCate.id);
                for(var i=0; i<newCate.dishes.length; i++) {
                    var dish=newCate.dishes[i];
                    $.post(urlReq, dish,
                        function(rtnData) {
                            dish['id']=rtnData.OK.id;
                        }, "json");
                }
                shopdata.cates.push(newCate);
                shop_CateCreateByEdit(newCate);
            }, "json");
            
        //console.log(JSON.stringify(resMenu.cateBlocks[0]));
    	return false;
    });
    
    $("a.dishEditPrimary").die("click");
    $("a.dishEditPrimary").live("click",function(){
    	var cateIdx=$(this).parent().parent(".dishEditContent").attr('cate_id');
    	var dishIdx=$(this).parent().parent(".dishEditContent").attr('dish_id');
    	var editContent=$("li.dishEditContent[cate_id="+cateIdx+"][dish_id="+dishIdx+"]");
    	//console.log("dishEditPrimary: enter,cateIdx=",cateIdx,"dishIdx=",dishIdx,editContent);
    	
    	var editArea=editContent.children(".editBox").children("textarea");
    	var rawCorrect=true;
    	var rawData=editArea.val();
    	//console.log("dishEditPrimary: %s",rawData);
    	var resMenu=shop_Raw2Json_menu(rawData);
    	if(resMenu==null) {
            rawCorrect=false;
        } else if(resMenu.dishes==null) {
            gErrMsg=String.format("Input is not dishTitle.");
            rawCorrect=false;
        } else if(resMenu.dishes.length!=1) {
            gErrMsg=String.format("Input too many dishTitle");
            rawCorrect=false;
        }
    
        if(rawCorrect==false) {
            editContent.addClass("errorEdit");
            $(this).siblings(".error-block").text(gErrMsg);
            $(this).siblings(".error-block").fadeIn("slow");
            return false;
        }

        var newDish=resMenu.dishes[0];
        if(dishIdx=='new' && shop_isDuplicateDish(shopdata,newDish)) {
            gErrMsg="商品名稱已重複";
            editContent.addClass("errorEdit");
            $(this).siblings(".error-block").text(gErrMsg);
            $(this).siblings(".error-block").fadeIn("slow");
            return false;
        }
    
        editContent.removeClass("errorEdit");
    	$(this).siblings(".error-block").text("");
    	$(this).siblings(".error-block").fadeOut("slow");
    	editContent.fadeOut("slow");
        editContent.next("ul").fadeOut("slow");
    
        //modify success then update ui
        if(dishIdx=='new') {
            var urlReq=String.format("/api/shops/{0}/cates/{1}/dishes/",shopdata.id,cateIdx);
            $.post(urlReq, newDish,
                function(rtnData) {
                    newDish['id']=rtnData.OK.id;
                    var cate=shop_getCate(shopdata,cateIdx);
                    cate.dishes.push(newDish);
                    shop_DishCreateByEdit(cateIdx,newDish);
                }, "json");
        }
        else {
            var urlReq=String.format("/api/shops/{0}/cates/{1}/dishes/{2}",shopdata.id,cateIdx,dishIdx);
            $.ajax( {
                type: "PUT",
                url: urlReq,
                data: JSON.stringify(newDish),
                dataType: "json",
                contentType: "application/json",
                success: function(){
                    //update to shopdata
                    newDish['id']=dishIdx;
                    shop_setDish(shopdata,newDish);
                    shop_DishUpdateByEdit(newDish);
                    console.log(shopdata);
                }
            });
        }
            
        console.log("dishEditPrimary:",JSON.stringify(resMenu.dishes[0]));
    	return false;
    });


    shop_InfoInit(shopdata);
    shop_MenuInit(shopdata);

}

function yshop_edit_init() {
    $('.tabs').tabs();
    //$.get( '/api/shops/13862',  function(shopdata) {
    /*$.get( '/api/shops/18521',  function(shopdata) {
        console.log(shopdata.OK);
        shop_edit_init(shopdata.OK);
    });*/
}
