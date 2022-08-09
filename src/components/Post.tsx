import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { Avatar } from './Avatar';
import { Comment } from './Comment';

import styles from './Post.module.css';

interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

interface PostProps {
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, publishedAt, content }: PostProps) {
  const [comments, setComments] = useState([
    'Post muito bacana, hein!'
  ]);

  const [newCommentText, setNewCommentText] = useState('');

  const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR
  });

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true
  });

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();

    setComments([...comments, newCommentText]);
    setNewCommentText('') // Programação declarativa aplicada. Definido que de onde venha o valor desse estado, o valor do textarea será equivalente ao mesmo
  }

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('');
    setNewCommentText(event.target.value);
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('Esse campo e obrigatório!');
  }

  function deleteComment(commentToDelete: string) {
    /*
      imutabilidade => variaveis não sofrem mutação - não se altera uma variável na memoria,
      se cria um novo valor em um novo espaço na memória!

      Para o react, criar um novo valor em um novo espaço na memória torna a
      aplicação mais performática no processo de comparação, dessa forma é
      mais rápido para ele saber se um determinado valor é algo novo ou não.

      Em outras palavras, ao utilizar a função de atualização de estado no react (setState),
      o react por baixo dos panos cria um novo valor em um novo local na memória. Ele não sobre-
      escreve o valor atual com um novo. Isso permite que ele tenha duas versões da variavel
      em locais diferentes para realizar uma determinada comparação, que o auxilia a determinar
      se o estádo está recebendo um novo valor ou se trata-se do mesmo.
    */
    const commentsWithoutDeletedOne = comments.filter(comment => {
      return comment !== commentToDelete;
    });

    setComments(commentsWithoutDeletedOne);
  }

  /*
    Clean Code = A ideia foi aplicada aqui para facilitar a manutenção. Em vez de disponibilizar a
    lógica newCommentText.length === 0 diretamente no input, o resultado foi atribuido a uma varí-
    ável autoexplicatíva, que diz exatamente quando o mesmo estará desabilitado.
  */
  const isNewCommentEmpty = newCommentText.length === 0; // Boa prática.

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>  
        {content.map(line => {
          if (line.type === 'paragraph') {
            return <p key={line.content}>{line.content}</p>;
          } else if (line.type === 'link') {
            return <p key={line.content}><a href='#'>{line.content}</a></p>
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Dexe seu feedback</strong>

        <textarea
          name='comment'
          placeholder="Deixe seu comentário"
          value={newCommentText} // Programação declarativa
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />

        <footer>
          <button type='submit' disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(comment => {
          return (
            <Comment
              key={comment}
              content={comment}
              onDeleteComment={deleteComment}
            />
          )
        })}
      </div>
    </article>
  );
}


/*
  Curiosidades sobre a key no React:

  Existem três momentos principais onde um determinado componente é renderizado novamente, são eles:
    1. Quando um estado é alterado.
    2. Quando um componente pai é alterado, todos os seus filhos também são renderizados.
    3. Quando a propriedade que um componente muda.
  
  Tendo isso em mente, componentes pais que apresentam iterações (listas como um map do JavaScript),
  podem sofrer modificações que geram uma nova reconstrução de todo o seu escopo. De acordo com o react,
  uma nova renderização do componente pai resultaria na execução de todas as iterações, o que não seria
  nada performático.
  
  Para contornar esse problema a key prop entra no palco. É possível notar que dentro de toda iteração
  o react solicita a definição de uma key prop unica capaz de receber qualquer valor para mapear a lista.
  Essa key prop é extremamente importante pois através dela o react consegue determinar o que já existia
  na renderização anterior e o que é novo na renderização atual, fazendo com que apenas o conteúdo novo
  da lista seja renderizado em conjunto com o que já existia antes. Isso impede que react perca tempo
  e outros recursos reprocessando algo que não mudou!
*/