import styles from './posts.module.css';
import Header from '../header/Header';
import Post from '../post/post';
import Tip from '../tip/tip';
import Subscription from '../subscription/subscription';
import Footer from '../footer/Footer';

function Posts({ posts, tips, user }: any) {
  return (
    <div className={styles.container} aria-live="polite">
      <div className={styles.headerDiv}>
        <Header user={user} />
      </div>
      <div id="wrapper">
        <main className={styles.main} id="main">
          <h1 className={styles.hOnes} id="latest">
            Latest
          </h1>
          <section className={styles.article}>
            {posts
              .sort((a: any, b: any) => {
                {
                  return a.createdAt > b.createdAt ? -1 : 1;
                }
              })
              .map((post: any) => {
                return <Post post={post} key={post._id} />;
              })}
          </section>
          <h1 className={styles.hOnes} id="popular">
            Popular
          </h1>
          <section className={styles.popular}>
            {posts
              .sort((a: any, b: any) => {
                {
                  return a.visits > b.visits ? -1 : 1;
                }
              })
              .map((post: any) => {
                return <Post post={post} key={post?._id} />;
              })}
          </section>
          <h1 className={styles.hOnes} id="tips">
            Tips
          </h1>
          <section className={styles.tipscard}>
            {tips.map((tip: any) => {
              return <Tip tip={tip} key={tip?._id} />;
            })}
          </section>
        </main>

        <section className={styles.mail__subscription}>
          <Subscription />
        </section>
        <Footer />
      </div>
    </div>
  );
}

export default Posts;
