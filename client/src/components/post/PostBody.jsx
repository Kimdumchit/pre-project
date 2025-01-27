import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Editor, Viewer } from '@toast-ui/react-editor';
import Button from '../Button';
import timeForToday from '../util/timeForToday';
import requestDataWithToken from '../util/requestNewAccessToken';

import Tag from '../Tag';
import Recommend from './Recommend';
import Comment from './Comment';

const PostBodyComponent = styled.div`
  display: flex;
  margin-top: 2rem;
  padding-left: 2rem;
  line-height: 1.25rem;
  border-bottom: 1px solid #d9d9d9;
  margin-bottom: 0.5rem;
  width: 926px;
  button {
    margin: 1rem 0 0 0;
  }
  code {
    /* border: 1px solid black; */
    padding: 0.3rem;
    border-radius: 5px;
    background: #dde1e6;
  }
  .post-body-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 1.25rem;
    margin-left: 1.25rem;
    a {
      text-decoration: none;
      color: #0074cc;
      :hover {
        color: #53a8fc;
      }
      :active {
        color: #53a8fc;
      }
    }

    .tags {
      display: flex;
      margin-top: 25px;
      margin-bottom: 18px;
    }

    .body-footer-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-top: 16px;
      .share {
        position: relative;
      }
      .menu-wrapper {
        display: flex;
        .menu-item {
          margin: 5px;
          color: #51565d;
          cursor: pointer;
          :hover {
            color: #828c98;
          }
          :active {
            color: #828c98;
          }
          .share-dropdown {
            position: absolute;
            top: 0;
            z-index: 1000;
            inset: 10px;
            width: 200px;
            height: 50px;
            margin: 0.7rem -0.7rem;
            border: 1px solid red;
          }
        }
      }

      .edited-date {
        font-size: 12px;
      }

      .post-owner-wrapper {
        width: 200px;
        background: #d9eaf7;
        padding: 5px 6px 7px 7px;
        border-radius: 3px;

        .created-date {
          color: #6e737c;
          font-size: 12px;
          margin-top: 1px;
          margin-bottom: 10px;
        }
        .user-info {
          display: flex;
          .user-img {
            height: 32px;
            width: 32px;
          }
          .user-details {
            margin-left: 8px;
            width: calc(100% - 40px);

            .reputation-score {
              color: #6a737c;
              margin-right: 2px;
              font-size: 12px;
            }
          }
        }
      }
    }

    .add-comment {
      font-size: 13px;
      padding: 1rem 0;
      color: #a6b4c2;
      :hover {
        color: #d3e7ff;
      }
      :active {
        color: #d3e7ff;
      }
    }
  }
  .comments {
    display: flex;
    align-items: center;
    border-top: 1px solid #d9d9d9;
    margin: 1.25rem 0;
    padding: 0.8rem 0;
  }
  .comment-input {
    width: 100%;
    display: flex;
    height: 2.5rem;
    margin-bottom: 1rem;
    input {
      width: 100%;
      margin-right: 1rem;
      border-radius: 5px;
      box-shadow: 0;
      border: 1px solid #d9d9d9;
      padding: 1rem;
    }
    button {
      height: 100%;
      margin: 0;
    }
  }
`;

function PostBody({
  post,
  answer,
  commentsArray,
  setCommentsArray,
  idx,
  setAnswersArray,
  answersArray,
}) {
  const {
    title,
    modifiedAt,
    questionId,
    tags,
    likeCount,
    content,
    memberId,
    profile,
  } = post;
  const navigate = useNavigate();
  const [newAnswer, setNewAnswer] = useState('');
  const [comment, setComment] = useState('');
  const [answerIsPatch, setAnswerIsPatch] = useState(false);
  const [replyArray, setReplyArray] = useState([]);
  const [isComment, setIsComment] = useState(false);
  const userId = localStorage.getItem('memberId');
  const [viewMore, setViewMore] = useState(false);
  const api = process.env.REACT_APP_API_URL;
  axios.defaults.withCredentials = true;
  const contentRef = useRef();
  const editorRef = useRef();

  useEffect(() => {
    if (answerIsPatch) {
      // 답변 edit 버튼을 눌렀을시 editor가 보여짐
      editorRef.current?.getInstance().setHTML(answer.answerContent);
    } else if (answer.answerId) {
      // answer - comment
      setReplyArray(answer.replies);
    }
  }, [answerIsPatch, viewMore]);
  const patchHandler = () => {
    if (answer.answerId) {
      // answer - isPatch, editor on
      setAnswerIsPatch(true);
    } else {
      // question - patch
      const contentArr = content.split(' <br calssName="boundary"/> ');
      const introduce = contentArr[0];
      const expand = contentArr[1];
      const data = {
        id: questionId,
        title,
        introduce,
        expand,
        tags: tags,
      };
      navigate(`/write`, { state: data });
    }
  };
  const editorOnChange = () => {
    // editor - onChange
    setNewAnswer(editorRef.current.getInstance().getHTML());
  };
  const deleteHandler = async () => {
    if (answer.answerId) {
      // answer - delete
      try {
        await requestDataWithToken(
          '',
          `${api}/answer/${answer.answerId}`,
          'delete'
        );
        const newAnswersArray = answersArray.filter(
          (v) => v.answerId !== answer.answerId
        );
        setAnswersArray(newAnswersArray);
      } catch (err) {
        alert('답변 삭제 실패');
        console.log(err);
      }
    } else {
      try {
        // question - delete
        await requestDataWithToken(
          '',
          `${api}/question/${questionId}`,
          'delete'
        );
        await navigate('/');
      } catch (err) {
        alert('질문 삭제 실패');
        console.log(err);
      }
    }
  };
  const answerPatchHandler = async () => {
    // answer - patch
    try {
      await requestDataWithToken(
        '',
        `${api}/answer/${answer.answerId}`,
        'patch',
        {
          answerContent: newAnswer,
        }
      );
      setAnswerIsPatch(false);
      const newAnswersArray = [...answersArray];
      newAnswersArray[idx].answerContent = newAnswer;
      setAnswersArray(newAnswersArray);
    } catch (err) {
      console.log(err);
      alert('답변 수정 실패');
    }
  };
  const commentSubmitHandler = async () => {
    if (answer.answerId) {
      try {
        // answer - comment - post
        await requestDataWithToken(
          '',
          `${api}/reply/${answer.answerId}`,
          'post',
          {
            replyContent: comment,
          }
        );
        const newPostData = await axios.get(`${api}/question/${questionId}`);
        await setReplyArray(newPostData.data.answers[idx].replies);
      } catch (err) {
        alert('답변 코멘트 작성 실패');
      }
    } else {
      try {
        // question - comment - post
        await requestDataWithToken('', `${api}/comment/${questionId}`, 'post', {
          content: comment,
        });
        const newPostData = await axios.get(`${api}/question/${questionId}`);
        await setCommentsArray(newPostData.data.comments);
      } catch (err) {
        alert('질문 코멘트 작성 실패');
      }
    }
    setComment('');
  };
  const commentOnDeleteHandler = async (id) => {
    if (answer.answerId) {
      // answer - comment - delete
      try {
        await requestDataWithToken('', `${api}/reply/${id}`, 'delete');
        const newReplysArray = [...replyArray].filter((v) => v.replyId !== id);
        setReplyArray(newReplysArray);
      } catch (err) {
        console.log(err);
        alert('답변 코멘트 삭제 실패');
      }
    } else {
      // question - comment - delete
      try {
        await requestDataWithToken('', `${api}/comment/${id}`, 'delete');
        const newCommentsArray = commentsArray.filter(
          (v) => v.commentId !== id
        );
        setCommentsArray(newCommentsArray);
      } catch (err) {
        console.log(err);
        alert('질문 코멘트 삭제 실패');
      }
    }
  };
  const commentOnPatchHandler = async (id, content, idx) => {
    if (answer.answerId) {
      // answer - comment - patch
      try {
        await requestDataWithToken('', `${api}/reply/${id}`, 'patch', {
          replyContent: content,
        });
        const newReplysArray = [...replyArray];
        newReplysArray[idx].replyContent = content;
        setReplyArray(newReplysArray);
      } catch (err) {
        alert('답변 코멘트 수정 실패');
        console.log(err);
      }
    } else {
      // question - comment - patch
      try {
        await requestDataWithToken('', `${api}/comment/${id}`, 'patch', {
          content,
        });
        const newCommentsArray = [...commentsArray];
        newCommentsArray[idx].content = content;
        setCommentsArray(newCommentsArray);
      } catch (err) {
        console.log('질문 코멘트 수정 실패');
        console.log(err);
      }
    }
  };
  const userimg =
    'https://www.gravatar.com/avatar/088029d211d686a016bcfdc326523d62?s=256&d=identicon&r=PG';

  return (
    <PostBodyComponent>
      <Recommend
        questionId={questionId}
        questionLikeCount={likeCount}
        answerId={answer.answerId}
        answerLikeCount={answer.answerLikesCount}
      />
      <div className="post-body-container">
        <section className="main-content" ref={contentRef}>
          {answerIsPatch ? (
            <div>
              <Editor
                initialValue={answer.answerContent}
                height="300px"
                initialEditType="markdown"
                onChange={(e) => editorOnChange()}
                useCommandShortcut={true}
                ref={editorRef}
                autofocus={true}
              />
              <Button onClick={answerPatchHandler}>수정</Button>
            </div>
          ) : (
            <Viewer initialValue={answer ? answer.answerContent : content} />
          )}
        </section>
        {!answer && (
          <section className="tags">
            {tags !== null &&
              tags.map((v, i) => (
                <Tag key={v} searchEvent={true}>
                  {v}
                </Tag>
              ))}
          </section>
        )}
        <section className="body-footer">
          <div className="body-footer-wrapper">
            <div className="menu-wrapper">
              <div
                className="menu-item"
                title="Short permalink to this question"
              >
                <div role="button" className="share">
                  Share
                </div>
              </div>
              {memberId === +userId ? (
                <div
                  className="menu-item"
                  title="Revise and improve this post"
                  onClick={patchHandler}
                >
                  Edit
                </div>
              ) : (
                <></>
              )}
              <div
                className="menu-item"
                title="Follow this question to receive notification"
              >
                Follow
              </div>
              {memberId === +userId ? (
                <div
                  className="menu-item"
                  title="Post delete"
                  onClick={deleteHandler}
                >
                  Delete
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="edited-date-wrapper">
              <div className="edited-date" title="Show all edits to this post">
                {`edited ${timeForToday(modifiedAt)}`}
              </div>
            </div>
            <div className="post-owner-wrapper">
              <div className="created-date">
                {new Date(profile.createdDate).toLocaleString()}
              </div>
              <div className="user-info">
                <div className="user-avatar">
                  <a href="/user">
                    <img className="user-img" src={userimg} alt="user-img" />
                  </a>
                </div>
                <div className="user-details">
                  <a href="/user">{profile.name}</a>
                  <div className="flair">
                    <span className="reputation-score">51</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {commentsArray && commentsArray.length && viewMore
          ? commentsArray.map((comment, i) => (
              <div className="comments" key={comment.commentId}>
                <Comment
                  onDelete={commentOnDeleteHandler}
                  onPatch={commentOnPatchHandler}
                  id={comment.commentId}
                  idx={i}
                >
                  {comment.content}
                </Comment>
              </div>
            ))
          : commentsArray && commentsArray.length && !viewMore
          ? commentsArray.slice(0, 3).map((comment, i) => (
              <div className="comments" key={comment.commentId}>
                <Comment
                  onDelete={commentOnDeleteHandler}
                  onPatch={commentOnPatchHandler}
                  id={comment.commentId}
                  idx={i}
                >
                  {comment.content}
                </Comment>
              </div>
            ))
          : replyArray.length && viewMore
          ? replyArray.map((v, i) => (
              <div className="comments" key={v.replyId}>
                <Comment
                  onDelete={commentOnDeleteHandler}
                  onPatch={commentOnPatchHandler}
                  id={v.replyId}
                  idx={i}
                >
                  {v.replyContent}
                </Comment>
              </div>
            ))
          : replyArray.slice(0, 3).map((v, i) => (
              <div className="comments" key={v.replyId}>
                <Comment
                  onDelete={commentOnDeleteHandler}
                  onPatch={commentOnPatchHandler}
                  id={v.replyId}
                  idx={i}
                >
                  {v.replyContent}
                </Comment>
              </div>
            ))}
        {(replyArray && replyArray.length > 3) ||
        (commentsArray && commentsArray.length > 3) ? (
          !viewMore ? (
            <div onClick={() => setViewMore(!viewMore)}>More view</div>
          ) : (
            <div onClick={() => setViewMore(!viewMore)}>less view</div>
          )
        ) : (
          <></>
        )}

        <section
          className="add-comment"
          onClick={() => setIsComment(!isComment)}
        >
          Add a comment
        </section>
        {isComment ? (
          <div className="comment-input">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={commentSubmitHandler}>submit</Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </PostBodyComponent>
  );
}

export default PostBody;
