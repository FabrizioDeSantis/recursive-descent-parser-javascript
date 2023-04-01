/**
 * Tokenizer
 */

export const TokenTypes = {
    NUMBER: "NUMBER",
    IDENTIFIER: "IDENTIFIER",
    PLUS: "+",
    MINUS: "-",
    MULTIPLY: "*",
    DIVIDE: "/",
    EXP: "^",
    PARENTHESIS_LEFT: "(",
    PARENTHESIS_RIGHT: ")"
};

const TokenSpecials = [
    [/^\s+/, null],
    [/^(?:\d+(?:\.\d*)?|\.\d+)/, TokenTypes.NUMBER],
    [/^[a-z]+/, TokenTypes.IDENTIFIER],
    [/^\+/, TokenTypes.PLUS],
    [/^\-/, TokenTypes.MINUS],
    [/^\*/, TokenTypes.MULTIPLY],
    [/^\//, TokenTypes.DIVIDE],
    [/^\^/, TokenTypes.EXP],
    [/^\(/, TokenTypes.PARENTHESIS_LEFT],
    [/^\)/, TokenTypes.PARENTHESIS_RIGHT]
];

export default class Tokenizer{

    constructor(input){
        this.input = input;
        this.cursor = 0;
    }

    thereIsMore(){ // check if there are more tokens in the input to be processed
        return this.cursor < this.input.length;
    }

    match(regex, inputText){ // return a match if the regex matches the input text
        const m = regex.exec(inputText)
        if (m == null){
            return null;
        }
        this.cursor += m[0].length;
        return m[0];
    }

    getNext(){ // retrieve the next token
        if (!this.thereIsMore()){ // if true there are more tokens in the input to be processed
            return null;
        }
        const inputText = this.input.slice(this.cursor); // slice function to lool at the remaining text

        for(let [regex, type] of TokenSpecials){
            const tokenValue = this.match(regex, inputText);
            if (tokenValue === null){
                continue;
            }
            if (type === null){
                return this.getNext();
            }
            return {
                type,
                value: tokenValue,
            }
        }

        throw new SyntaxError(`Unexpected token: "${inputText[0]}"`);
    }
}