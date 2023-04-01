import Tokenizer from "./tokenizer.js"
import {TokenTypes} from "./tokenizer.js"

export default class Parser{

    parse(input){

        this.input = input;
        this.tokenizer = new Tokenizer(input);
        this.peek = this.tokenizer.getNext();

        return this.Expression();
    }

    consume(tokenType){
        const token = this.peek;

        if(token == null){
            throw new SyntaxError(`Unexpected EOF, expected: "${tokenType}"`);
        }

        if(token.type !== tokenType){
            throw new SyntaxError(`Unexpected token: "${token.value}", expected "${tokenType}"`);
        }

        this.peek = this.tokenizer.getNext();

        return token;
    }

    Expression() {
        return this.Primary();
    }

    Primary() {
        const token = this.consume(TokenTypes.NUMBER);
        return Number(token.value);
    }
}