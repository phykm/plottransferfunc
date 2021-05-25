export default {arrageToComplexes,evalPolynomial,coefficients,frequencyResponseOfRationalTransferFunction};

import {complex, multiply, subtract ,add, divide, pi} from "mathjs";

// stateが保持しているデータが{onReal:Bool,points: [{x:Number,y:Number}]}
// なので、これをストレートに直す。onRealが立っているときは、pointsは要素を２つもち、それ以外では一つ。
// complex の Arrayを返す。
function arrageToComplexes(ptArray) {
    let arranged = []
    ptArray.forEach(v => {
        if (v.onReal) {
            let pt = v.points[0]
            arranged.push(complex({re:pt.x,im:pt.y}))
        } else {
            let pt0 = v.points[0]
            let pt1 = v.points[1]
            arranged.push(complex({re:pt0.x,im:pt0.y}))
            arranged.push(complex({re:pt1.x,im:pt1.y}))
        }
    })
    return arranged
}

// 有理関数フィルターの周波数特性
function frequencyResponseOfRationalTransferFunction(zeros,poles,samplingRate) {
    return function(frequency) {
        let dt = 1/samplingRate
        let arg = dt * 2 * pi * frequency
        let z = complex({abs:1,arg:arg})
        return (rationalTransferFunctionFromZeroAndPoles(zeros,poles)(z))
    }
}

// 有理関数フィルターの伝達関数
function rationalTransferFunctionFromZeroAndPoles(zeros,poles) {
    return function(input) {
        let numerator = evalPolynomial(coefficients(zeros),input)
        let denominator = evalPolynomial(coefficients(poles),input)
        return divide(numerator,denominator)
    }
}

// (1-az^{-1})の形で因数分解されていると仮定し、z^{-n}展開時の係数を計算する。
function coefficients(complexes) {
    let coeff = [complex(1,0)] // i番目がz^{-i}の係数とする。
    complexes.forEach(v => {
        let last = coeff[coeff.length-1]
        for (let i=(coeff.length-1) ; i>0 ; i--) {
            coeff[i] = subtract(
                coeff[i],
                multiply(v,coeff[i-1])
            )
        }
        coeff.push(multiply(v,multiply(last,-1)))
    })
    return coeff
}

// 係数を多項式とみなして評価する
function evalPolynomial(complexes,input) {
    if (complexes.length === 0) {
        return 0
    }
    let head = complexes[0]
    let size = complexes.length 
    return add(
        head,
        multiply(
            input,
            evalPolynomial(complexes.slice(1,size),input)
        )
    )
}