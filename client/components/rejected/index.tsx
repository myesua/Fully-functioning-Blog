import styles from './styles.module.css';
import Link from 'next/link';

function Rejected({ a }: any) {
  return (
    <article className={styles.container} id="post">
      <div className={styles.head}>
        <Link href={`/post/${a.slug}`}>
          <a>
            <img src={a.banner} className={styles.image} alt="Post Image" />
          </a>
        </Link>
      </div>
      <div className={styles.body}>
        <Link href={`/post/${a.slug}`}>
          <a>
            <h3 className={styles.title} id="post-title">
              {a.title}
            </h3>
          </a>
        </Link>

        <p className={styles.desc}>{a.description}</p>
        <p className={styles.reading__time} id="reading-time">
          {a.readingTime}
        </p>
      </div>
      <div className={styles.categories}>
        {a.categories.map((category: any) => {
          return (
            <Link href={`/?cat=${category}`} key={category?._id}>
              <a>
                <span className={styles.tag} id="tag">
                  {category.toLowerCase()}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
      <div className={styles.author} id="author">
        <Link href={`/?user=${a.author}`}>
          <a>
            <img src={a.avatar} className={styles.avatar} alt="Profile Image" />
          </a>
        </Link>
        <time className={styles.time}>
          {new Date(a.createdAt).toDateString().slice(4)}
        </time>
      </div>
    </article>
  );
}

export default Rejected;
