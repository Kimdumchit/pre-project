package com.codestates.stackoverflow.exception;

import lombok.Getter;

public enum ExceptionCode {

    NOT_WRITER(401,"You are not Writer"),
    LOGIN_FAILED(401, "It's an ID you didn't sign up for, or it's an incorrect password."),
    MEMBER_NOT_FOUND(404, "Member not found"),
    QUESTION_NOT_FOUND(404, "Question not found"),
    MEMBER_EXISTS(409, "Member exists"),
    EMAIL_EXISTS(409, "Email exists"),
    NAME_EXISTS(409, "Name exists"),
    ANSWER_NOT_FOUND(404,"Answer not found");

    @Getter
    private int status;

    @Getter
    private String message;

    ExceptionCode(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
