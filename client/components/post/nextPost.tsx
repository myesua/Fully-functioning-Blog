import card from './nextpost.module.css';
import Link from 'next/link';
import Image from 'next/image';

function NextPost({ post }: any) {
  return (
    <article className={card.container}>
      <div className={card.head}>
        <Link href={`/post/${post.slug}`}>
          <a>
            <img src={post.banner} className={card.image} alt="Post Image" />
          </a>
        </Link>
      </div>
      <div className={card.body}>
        <Link href={`/post/${post.slug}`}>
          <a>
            <h3 className={card.title}>{post.title}</h3>
          </a>
        </Link>
        <p className={card.desc}>{post?.description}</p>
        <p className={card.reading__time}>{post.readingTime}</p>
      </div>
      <div className={card.categories}>
        {post?.categories.map((category: any, index: any) => {
          return (
            <Link href={`/?cat=${category}`} key={index}>
              <a className={card.tag}>{category.toLowerCase()}</a>
            </Link>
          );
        })}
      </div>
      <div className={card.author}>
        <Link href={`/?user=${post.author}`}>
          <a>
            <img
              src={post.avatar}
              className={card.avatar}
              alt="Profile Image"
            />
          </a>
        </Link>
        <time className={card.time}>
          {new Date(post.createdAt).toDateString().slice(4)}
        </time>
      </div>
    </article>
  );
}

export default NextPost;
