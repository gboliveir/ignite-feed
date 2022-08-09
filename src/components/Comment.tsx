import { useState } from 'react';
import { Trash, ThumbsUp } from 'phosphor-react';
import { Avatar } from './Avatar';

import styles from './Comment.module.css';

interface CommentProps {
  content: string;
  onDeleteComment: (comment: string) => void;
}

export function Comment({ content, onDeleteComment }: CommentProps) {
  const [likeCount, setLikeCount] = useState(0);

  function handleDeleteComment() {
    onDeleteComment(content)
  }

  function handleLikeComment() {
    /*
      Para atualizar o valor de likeCount e necessário resgatar o valor mais atualizado do mesmo.
      Existem duas forma de resgatar o valor mais atualizado de um estado, são elas:

      1. Passando uma função para a função de atualização de estado, que é capaz de receber o seu valor
      mais atual.
        setLikeCount((state) => {
          state + 1
        });
      2. Atribuindo o valor atual do estádo a uma nova varíável antes de qualquer processamento e apenas
      no final realizar a atualização de estado.
        const newLikeCount = likeCount + 1; 
        setNewLikeCount(newLikeCount);
    */
    setLikeCount((state) => {
      return state + 1
    });
  }

  return (
    <div className={styles.comment}>
      <Avatar hasBorder={false} src='https://avatars.githubusercontent.com/u/71530159?v=4' />

      <div className={styles.commentBox}>
        <div className={styles.commentContent}>
          <header>
            <div className={styles.authorAndTime}>
              <strong>Gabriel Brito</strong>
              <time title='11 de Maio às 08:13h' dateTime="2022-05-11 08:13:30">Cerca de 1h atrás</time>
            </div>

            <button onClick={handleDeleteComment} title='Deletar comentário'>
              <Trash size={24} />
            </button>
          </header>
          
          <p>{content}</p>
        </div>

        <footer>
          <button onClick={handleLikeComment}>
            <ThumbsUp />
            Aplaudir <span>{likeCount}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}