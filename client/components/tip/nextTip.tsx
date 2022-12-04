import Link from 'next/link';
import card from './tip.module.css';

function NextTip({ tip }: any) {
  return (
    <div className={card.tip}>
      <header className={card.tipheader}>
        <span>
          <Link href="/">
            <a>🔧</a>
          </Link>
        </span>
        <span>
          <Link href="/">
            <a>Tips</a>
          </Link>
        </span>
      </header>
      <main className={card.tipbody}>
        <h3 className={card.tiptitle}>
          <Link href={`/tip/${tip.slug}`}>
            <a>{tip.title}</a>
          </Link>
        </h3>
        <p className={card.desc}>{tip.description}</p>
      </main>
      <footer className={card.tipauthor}>
        <Link href="/dashboard">
          <a>
            <img src={tip.avatar} className={card.avatar} alt="Profile Image" />
          </a>
        </Link>
        <time>{new Date(tip.createdAt).toDateString()}</time>
      </footer>
    </div>
  );
}

export default NextTip;
