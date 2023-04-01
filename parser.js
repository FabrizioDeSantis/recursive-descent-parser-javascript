/**
 * Expression = Term (("+" | "-") Term)*
 * Term = Factor (("*" | "/") Factor)*
 * Factor = Primary ("^" Factor)*
 * Primary = Parenthesis | NUMBER | UnaryExpression
 * Parenthesis = "(" Expression ")"
 * UnaryExpression = "-" Factor
 */

import Tokenizer from "./tokenizer.js"
import {TokenTypes} from "./tokenizer.js"

export default class Parser{

    parse(input){

        this.input = input;
        this.tokenizer = new Tokenizer(input);
        this.lookhead = this.tokenizer.getNext();

        return this.Expression();
    }

    consume(tokenType){
        const token = this.lookhead;

        if(token == null){
            throw new SyntaxError(`Unexpected EOF, expected: "${tokenType}"`);
        }

        if(token.type !== tokenType){
            throw new SyntaxError(`Unexpected token: "${token.value}", expected "${tokenType}"`);
        }

        this.lookhead = this.tokenizer.getNext();

        return token;
    }

    /**
     * this method accepts 4 parameters: leftRule, rightRule, operator1 and operator2
     * both leftRule and rightRule are Term rules
     */

    BinaryExpr(leftRule, rightRule, operator1, operator2){

        let x = leftRule();

        while(
            this.lookhead && (this.lookhead.type === operator1 || this.lookhead.type === operator2)
        ){
            const operator = this.consume(this.lookhead.type).type;
            switch (operator){
                case TokenTypes.PLUS:
                    x = x + rightRule();
                    break;
                case TokenTypes.MINUS:
                    x = x - rightRule();
                    break;
                case TokenTypes.MULTIPLY:
                    x = x * rightRule();
                    break;
                case TokenTypes.DIVIDE:
                    x = x / rightRule();
                    break;
                case TokenTypes.EXP:
                    x = x ** rightRule();
                    break;
            }
        }

        return x;

    }


    Expression() {

        return this.BinaryExpr(
            () => this.Term(),
            () => this.Term(),
            TokenTypes.PLUS,
            TokenTypes.MINUS
        );
    }

    Term(){
        
        return this.BinaryExpr(
            () => this.Factor(),
            () => this.Factor(),
            TokenTypes.MULTIPLY,
            TokenTypes.DIVIDE
        );

    }

    Factor(){

        return this.BinaryExpr(
            () => this.Primary(),
            () => this.Factor(),
            TokenTypes.EXP
        );

    }

    Primary() {

        if(this.lookhead.type === TokenTypes.PARENTHESIS_LEFT){
            return this.Parenthesis();
        }
        if(this.lookhead.type === TokenTypes.MINUS){
            return this.UnaryOp();
        }
        const token = this.consume(TokenTypes.NUMBER);

        return Number(token.value);
    }

    Parenthesis(){

        this.consume(TokenTypes.PARENTHESIS_LEFT);
        const expr = this.Expression();
        this.consume(TokenTypes.PARENTHESIS_RIGHT);

        return expr;
    }

    UnaryOp(){
        this.consume(TokenTypes.MINUS);
        return -this.Factor();
    }
}