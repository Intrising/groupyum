require 'spec_helper'

describe Shop do
  before do
  end

  describe '#shop_operations' do
    let(:roadname) { 'super road no1' }
    let(:shopname) { 'mama cake' }
    it 'create a new shop' do
      Shop.destroy_all
      s=Shop.new( :name=>shopname, :address=>roadname)
      s.save!
      Shop.where( :name=>shopname).count.should > 0
    end

    it 'should raise an error' do
      expect {
        s=Shop.new( :address=>'mario land')
        s.save!
      }.to raise_error( )
    end

    it 'query the shop' do
      s = Shop.where( :name=>shopname).first
      s.address.should == roadname
    end

    it 'create a category for the shop' do
       s = Shop.where( :name=>shopname).first
     
    end
  end
end
