import styles from './footer.module.css';
import Image from 'next/image';
import Link from 'next/link';

import Twitter from '../../public/twitter.svg';
import Youtube from '../../public/youtube.svg';
import Facebook from '../../public/facebook.svg';

const Footer = () => {
  return (
    <div>
      <footer className={styles.footer}>
        <div className={styles.footer__action}>
          <h5>Give your vehicle a proper mechanical attention</h5>
          <p>
            Donec lobortis sed augue non convallis. Maecenas venenatis tortor
            mauris, luctus dapibus lacus dictum sit amet. Proin tincidunt
            facilisis aliquet. Donec vitae consequat est, sed semper erat.
            Quisque viverra lacus nec ex tristique, sed tempor elit porta. Duis
            et ultrices orci. Nullam finibus, elit ut iaculis ultrices, dui
            ipsum vestibulum nisi, quis efficitur turpis dui ac lorem.
          </p>
          <p></p>
          <button>Talk to a mechanic</button>
        </div>

        <div className={styles.footer__social}>
          <h5>Follow us on</h5>
          <ul className={styles.fs__icons}>
            <li>
              <Link href="/">
                <a>
                  <Image
                    className={styles.fs__icons__img}
                    src={Twitter}
                    width={40}
                    height={40}
                    alt="Twitter"
                  />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>
                  <Image
                    className={styles.fs__icons__img}
                    src={Youtube}
                    width={40}
                    height={40}
                    alt="Twitter"
                  />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>
                  <Image
                    className={styles.fs__icons__img}
                    src={Facebook}
                    width={40}
                    height={40}
                    alt="Twitter"
                  />
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.footer__privacy}>
          <span>
            Copyright &copy; 2022 Bechellente Technologies. All Rights Reserved.
          </span>
          <ul>
            <li>
              <Link href="/">
                <a>Privacy Policy</a>
              </Link>
            </li>
            <li>|</li>
            <li>
              <Link href="/">
                <a>About Bechellente</a>
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
