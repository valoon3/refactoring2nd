
class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() { // amountFor() 함수의 코드를 계산기 클래스로 복사
        throw new Error('서브클래스에서 처리하도록 설계되었습니다.');
    }

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if("comedy" === this.play.type)
            result += Math.floor(this.performance.audience / 5);

        return result;
    }

}

class TragedyCalculator extends PerformanceCalculator{
// 이 메서드를 서브 클래스에 정의하기만 해도 슈퍼클래스(PerformanceCalculator)의 조건부 로직이 오버라이드된다.

    get amount() {
        let result = 40000;
        if(this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30)
        }
        return result;
    }

}


class ComedyCalculator extends PerformanceCalculator{

    get amount() {
        let result = 30000;
        if(this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }

}



function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);

    return statementData;

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
// const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));

        const result = Object.assign({}, aPerformance); // 얕은 복사 수행
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = volumeCreditsFor(result);

        return result;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance) { // 함수 추출
        return createPerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0); // 반복문을 파이프라인으로 바꾸기
    }

    function createPerformanceCalculator(aPerformance, aPlay) { // 생성자를 팩터리 함수로 바꾸기
        switch(aPlay.type) {
            case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
            case "comedy": return new ComedyCalculator(aPerformance, aPlay);
            default: throw Error(`알 수 없는 장르 : ${aPlay.type}`);
        }
    }

}

// export default createStatementData;
module.exports = createStatementData;