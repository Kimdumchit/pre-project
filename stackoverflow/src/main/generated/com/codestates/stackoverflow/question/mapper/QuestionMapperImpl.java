package com.codestates.stackoverflow.question.mapper;

import com.codestates.stackoverflow.answer.entity.Answer;
import com.codestates.stackoverflow.comment.entity.Comment;
import com.codestates.stackoverflow.question.dto.QuestionDto;
import com.codestates.stackoverflow.question.entity.Question;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2022-10-31T09:42:34+0900",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 17.0.3 (Azul Systems, Inc.)"
)
@Component
public class QuestionMapperImpl implements QuestionMapper {

    @Override
    public Question questionPostToQuestion(QuestionDto.Post requestBody) {
        if ( requestBody == null ) {
            return null;
        }

        Question question = new Question();

        question.setTitle( requestBody.getTitle() );
        question.setContent( requestBody.getContent() );
        String[] tags = requestBody.getTags();
        if ( tags != null ) {
            question.setTags( Arrays.copyOf( tags, tags.length ) );
        }

        return question;
    }

    @Override
    public Question questionPatchToQuestion(QuestionDto.Patch requestBody) {
        if ( requestBody == null ) {
            return null;
        }

        Question question = new Question();

        question.setQuestionId( requestBody.getQuestionId() );
        question.setTitle( requestBody.getTitle() );
        question.setContent( requestBody.getContent() );
        question.setBounty( requestBody.getBounty() );
        String[] tags = requestBody.getTags();
        if ( tags != null ) {
            question.setTags( Arrays.copyOf( tags, tags.length ) );
        }

        return question;
    }

    @Override
    public QuestionDto.Response questionToQuestionResponse(Question question) {
        if ( question == null ) {
            return null;
        }

        QuestionDto.Response response = new QuestionDto.Response();

        if ( question.getQuestionId() != null ) {
            response.setQuestionId( question.getQuestionId() );
        }
        response.setTitle( question.getTitle() );
        response.setContent( question.getContent() );
        response.setBounty( question.getBounty() );
        response.setViewCount( question.getViewCount() );
        response.setLikeCount( question.getLikeCount() );
        response.setCreatedAt( question.getCreatedAt() );
        response.setModifiedAt( question.getModifiedAt() );
        String[] tags = question.getTags();
        if ( tags != null ) {
            response.setTags( Arrays.copyOf( tags, tags.length ) );
        }
        List<Comment> list = question.getComments();
        if ( list != null ) {
            response.setComments( new ArrayList<Comment>( list ) );
        }
        List<Answer> list1 = question.getAnswers();
        if ( list1 != null ) {
            response.setAnswers( new ArrayList<Answer>( list1 ) );
        }

        return response;
    }

    @Override
    public List<QuestionDto.Response> questionsToQuestionResponses(List<Question> questions) {
        if ( questions == null ) {
            return null;
        }

        List<QuestionDto.Response> list = new ArrayList<QuestionDto.Response>( questions.size() );
        for ( Question question : questions ) {
            list.add( questionToQuestionResponse( question ) );
        }

        return list;
    }
}
