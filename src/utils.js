import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';

import { format, lightFormat, parseISO, formatDistanceToNow, formatDistanceStrict, differenceInDays } from 'date-fns'
const DATE_FORMAT_STRING = 'yyyy-MM-dd'


const capitalize = (word) => word.charAt(0).toUpperCase() + word.substring(1);
function pretiffyKey(name) {
    const words = name.match(/[A-Za-z0-9][a-z]*/g) || [];
    return words.map(capitalize).join(" ");
}


const daysFormattedDates = ['startDate', 'endDate']
const fieldsWithPences = ['raisedAmountTomorrow', 'sharePriceWithPences', 'targetAmountWithPences', 'AmountWithPences']
const currencyRegexps = [/gbp/i, /value/i, /averageInvestment/i, /biggestInvestmentValue/i]


const customerIdRegexps = [/magentoUserId/i, /BuyerMagentoUserId/i, /RedeemUserId/i]


const prettifyKV = (key, value, options = {}) => {

    if (daysFormattedDates.includes(key)) {
        const date = parseISO(value)
        const dateInWords = formatDistanceStrict(date, new Date(), { unit: 'day', addSuffix: true })
        const title = String(date)
        return (
            <Tooltip title={title}>
                <p>{dateInWords}</p>
            </Tooltip>)
    }

    const isCustomerId = customerIdRegexps.some(re => re.test(key))
    if (isCustomerId) {
        return <Link to={`/customer/${value} `}><Tooltip title={`Go to ${key} file`}><p>{value}</p></Tooltip></Link>;
    }

    const isGBP = currencyRegexps.some(re => re.test(key))
    const withPences = fieldsWithPences.includes(key)
    return prettifyValue(value, withPences, isGBP)

}

// eslint-disable-next-line no-restricted-globals
const prettifyValue = (value, withPences, isGBP) => {
    switch (typeof value) {
        case 'number':
            // eslint-disable-next-line radix
            const formattedNum = Number.parseFloat(withPences ? (value / 100) : value).toLocaleString(undefined, { maximumFractionDigits: 2 })
            return withPences || isGBP ? `£${formattedNum} ` : formattedNum
        case 'string':
            try {
                const date = parseISO(value)
                const dateInWords = formatDistanceToNow(parseISO(value), { addSuffix: true })
                const title = String(date)
                return (
                    <Tooltip title={title}>
                        <p>{dateInWords}</p>
                    </Tooltip>)
            } catch (e) {
                return value !== null && value !== undefined && value !== 'null' ? value : '';
            }
        default:
            // case 'undefined':
            // case 'object':
            return value !== null && value !== undefined ? JSON.stringify(value) : ''
    }
}


// Shamelessly copied from  https://stackoverflow.com/questions/1484506/random-color-generator
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch (i % 6) {
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
        default: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}
//https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
const niceColors = ["#d883ff", "#9336fd", "#1be7ff", "#6eeb83", "#e4ff1a", "#e8aa14", "#ff5714", "#f94144", "#f050ae", "#f3722c", "#f8961e", "#f9844a", "#f9c74f", "#90be6d", "#43aa8b", "#4d908e", "#577590", "#277da1", "#33a8c7", "#52e3e1", "#a0e426", "#fdf148", "#ffab00", "#f77976"]
// const css141colors = ['#ff0000', '#800080', '#ff00ff', '#008000', '#00ff00', '#808000', '#ffff00', '#000080', '#0000ff', '#008080', '#00ffff', '#ffa500', '#f0f8ff', '#faebd7', '#7fffd4', '#f0ffff', '#f5f5dc', '#ffe4c4', '#ffebcd', '#8a2be2', '#a52a2a', '#deb887', '#5f9ea0', '#7fff00', '#d2691e', '#ff7f50', '#6495ed', '#fff8dc', '#dc143c', '#00ffff', '#00008b', '#008b8b', '#b8860b', '#a9a9a9', '#006400', '#a9a9a9', '#bdb76b', '#8b008b', '#556b2f', '#ff8c00', '#9932cc', '#8b0000', '#e9967a', '#8fbc8f', '#483d8b', '#2f4f4f', '#2f4f4f', '#00ced1', '#9400d3', '#ff1493', '#00bfff', '#696969', '#696969', '#1e90ff', '#b22222', '#fffaf0', '#228b22', '#dcdcdc', '#f8f8ff', '#ffd700', '#daa520', '#adff2f', '#808080', '#f0fff0', '#ff69b4', '#cd5c5c', '#4b0082', '#fffff0', '#f0e68c', '#e6e6fa', '#fff0f5', '#7cfc00', '#fffacd', '#add8e6', '#f08080', '#e0ffff', '#fafad2', '#d3d3d3', '#90ee90', '#d3d3d3', '#ffb6c1', '#ffa07a', '#20b2aa', '#87cefa', '#778899', '#778899', '#b0c4de', '#ffffe0', '#32cd32', '#faf0e6', '#ff00ff', '#66cdaa', '#0000cd', '#ba55d3', '#9370db', '#3cb371', '#7b68ee', '#00fa9a', '#48d1cc', '#c71585', '#191970', '#f5fffa', '#ffe4e1', '#ffe4b5', '#ffdead', '#fdf5e6', '#6b8e23', '#ff4500', '#da70d6', '#eee8aa', '#98fb98', '#afeeee', '#db7093', '#ffefd5', '#ffdab9', '#cd853f', '#ffc0cb', '#dda0dd', '#b0e0e6', '#bc8f8f', '#4169e1', '#8b4513', '#fa8072', '#f4a460', '#2e8b57', '#fff5ee', '#a0522d', '#87ceeb', '#6a5acd', '#708090', '#708090', '#fffafa', '#00ff7f', '#4682b4', '#d2b48c', '#d8bfd8', '#ff6347', '#40e0d0', '#ee82ee', '#f5deb3', '#f5f5f5']
const fixedColors = (length) => niceColors.slice(0, length)
const rndColor = () => "#" + ("000000" + Math.floor(Math.random() * 16777216).toString(16)).substr(-6)
const rndColors = (length) => Array.from({ length }, rndColor)


export { rndColors, fixedColors, rainbow, prettifyValue, pretiffyKey, prettifyKV, capitalize }
