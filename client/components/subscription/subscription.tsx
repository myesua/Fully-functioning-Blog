import card from './subscription.module.css';

function Subscription() {
  return (
    <div className={card.subscription__container}>
      <div className={card.subscription__body}>
        <header>
          <h5 className={card.subscription__header}>
            Sign up to receive our headlines in your inbox
          </h5>
        </header>
        <div className={card.subscription__input}>
          <input
            type="text"
            placeholder="Email Address"
            aria-required="true"
            aria-invalid="true"
          />
          <div className={card.subscription__submit}>
            <span className={card.subscription__arrow}>→</span>
          </div>
        </div>
        <div className={card.subscription__agreement}>
          <label className={card.subscription__label}>
            <input type="checkbox" />
            <span className={card.checkmark}></span>
          </label>
          <p>
            I agree to provide my email address to &quot;Bechellente Ltd&quot;
            to receive information about new posts on the site. I understand
            that I can withdraw this consent at any time via e-mail by clicking
            the &quot;unsubscribe&quot; link that I find at the bottom of any
            e-mail sent to me for the purposes mentioned above.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
