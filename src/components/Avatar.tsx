import { ImgHTMLAttributes } from 'react';
import styles from './Avatar.module.css';

/*
  Com a tipagem global (Generic) é possível herdar todas as propriedades já existentes de uma TAG HTML e
  reaproveita-las em componentes que retornam essa mesma TAG, isso auxilia na inteligência do
  TypeScript e consequentemnte na produtividade.
*/
interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  hasBorder?: boolean;
}

/*
  Utilizando Rest Operator para pegar todas as outras propriedades passadas para o componente, e
  jogando-as dentro de uma unica variável. Dessa forma não é necessário pegar cada uma delas por
  desestruturação e passar manualmente para o componente (Evitando um procedimento cansativo).
*/
export function Avatar({ hasBorder = true, ...props }: AvatarProps) {
  return (
    <img
      className={hasBorder ? styles.avatarWithBorder : styles.avatar}
      {...props}
    />
  );
}