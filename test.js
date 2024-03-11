function convertEngNumToBangNum(amount) {
    const engToBangNum = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    String.prototype.getBangFromEng = function() {
        const trans = this;
        for (const x in engToBangNum) {
             trans = trans.replace(new RegExp(x, 'g'), engToBangNum[x]);
        }
        return trans;
    };

    const banglaConvertedNum=amount.getBangFromEng();
    return banglaConvertedNum;
}

console.log("Bangla Number: ", convertEngNumToBangNum("5:30"))