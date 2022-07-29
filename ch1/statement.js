// 좋은 코드를 가늠하는 확실한 방법은 '얼마나 수정하기 쉬운가' 이다.

// 리펙토링 단계
// 단계 쪼개기 -> 계산 코드와 출력 코드를 분리
// 코드 구조 보강 -> 계산 로직을 다형성으로 표현

// 1. 함수 추출하기
// 2. 변수 인라인하기
// 3. 함수 옮기기
// 4. 조건부 로직을 다형성으로 바꾸기


// import createStatementData from './createStatementData.js';
const createStatementData = require('./createStatementData');

const data = [
    {
        customer: "BigCo",
        performances: [
            {
                "playID": "hamlet",
                "audience": 55
            },
            {
                "playID": "as-like",
                "audience": 35
            },
            {
                "playID": "othello",
                "audience": 40
            }
        ]
    }
];
const plays = {
    "hamlet": {"name": "Hamlet", "type":  "tragedy"},
    "as-like": {"name": "As You Like It", "type": "comedy"},
    "othello": {"name": "Othello", "type": "tragedy"}
};

// 데이터는 최대한 불변 처럼 취급해야한다.
function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays)); // 중간 데이터 구조를 인수로 전달
}

function renderPlainText(data, plays) {
    let result = `청구 내역 (고객명: ${data.customer}
`;

    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)}
`; // 인라인된 변수 삽입
    }

    result += `총액: ${usd(data.totalAmount)}
`;
    result += `적립 포인트: ${data.totalVolumeCredits}점
`;

    return result;


    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber / 100);
    }

}


function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
    let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>
`;
    result += "<table>";
    result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
    for(let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td><th>${usd(perf.amount)}</th></tr>
`;
    }
    result += "</table>";
    result += `<p>총액 : <em>${usd(data.totalAmount)}</em></p>`
    result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>`;

    return result;


    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(aNumber / 100);
    }
}

let price = statement(data[0], plays);
console.log(price);