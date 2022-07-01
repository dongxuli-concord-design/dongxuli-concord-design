// https://jaysoo.ca/2014/03/20/i18n-with-es2015-template-literals/

// Matches optional type annotations in _i18n strings.
// e.g. _i18n`This is a number ${x}:n(2)` formats x as number
//      with two fractional digits.
class XcSysI18n {
  #localizers;

  constructor({messageBundle = null} = {}) {
    this.locale = XcSysConfig.locale;
    this.defaultCurrency = '';
    this.messageBundle = messageBundle;

    this.#localizers = {
      s /*string*/: v => v.toLocaleString(this.locale),
      c /*currency*/: (v, currency) => (
        v.toLocaleString(this.locale, {
          style: 'currency',
          currency: currency || this.defaultCurrency
        })
      ),
      n /*number*/: (v, fractionalDigits) => (
        v.toLocaleString(this.locale, {
          minimumFractionDigits: fractionalDigits,
          maximumFractionDigits: fractionalDigits
        })
      )
    };

    return this;
  }

  static #extractTypeInfo(str) {
    const match = XcSysI18n.typeInfoRegex.exec(str);
    if (match) {
      return {type: match[1], options: match[3]};
    } else {
      return {type: 's', options: ''};
    }
  }

  T(strings, ...values) {
    const translationKey = this.#buildKey(strings);
    let translationString = null;

    if (this.messageBundle) {
      translationString = this.messageBundle[translationKey];
      if (!translationString) {
        translationString = translationKey;
      }
    } else {
      translationString = translationKey;
    }

    const typeInfoForValues = strings.slice(1).map(XcSysI18n.#extractTypeInfo);
    const localizedValues = values.map((v, i) => this.#localize(v, typeInfoForValues[i]));
    return this.#buildMessage(translationString, ...localizedValues);
  }

  #localize(value, {type, options}) {
    return this.#localizers[type](value, options);
  }

  // e.g. I18n.#buildKey(['', ' has ', ':c in the']) == '{0} has {1} in the bank'
  #buildKey(strings) {
    const stripType = s => s.replace(XcSysI18n.typeInfoRegex, '');
    const lastPartialKey = stripType(strings[strings.length - 1]);
    const prependPartialKey = (memo, curr, i) => `${stripType(curr)}{${i}}${memo}`;

    return strings.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
  }

  // e.g. I18n.#formatStrings('{0} {1}!', 'hello', 'world') == 'hello world!'
  #buildMessage(str, ...values) {
    return str.replace(/{(\d)}/g, (_, index) => values[Number(index)]);
  }
}

XcSysI18n.typeInfoRegex = /^:([a-z])(\((.+)\))?/;

// Usage
// let messageBundle_fr = {
//   'Hello {0}, you have {1} in your bank account.': 'Bonjour {0}, vous avez {1} dans votre compte bancaire.'
// };
//
// let messageBundle_de = {
//   'Hello {0}, you have {1} in your bank account.': 'Hallo {0}, Sie haben {1} auf Ihrem Bankkonto.'
// };
//
// let messageBundle_zh_Hant = {
//   'Hello {0}, you have {1} in your bank account.': '你好{0}，你有{1}在您的銀行帳戶。'
// };
//
// let name = 'Bob';
// let amount = 1234.56;
// let _i18n;
//
// _i18n = I18n.use({locale: 'fr-CA', defaultCurrency: 'CAD', messageBundle: messageBundle_fr});
// console.log(_i18n `Hello ${name}, you have ${amount}:c in your bank account.`);
//
// _i18n = I18n.use({locale: 'de-DE', defaultCurrency: 'EUR', messageBundle: messageBundle_de});
// console.log(_i18n `Hello ${name}, you have ${amount}:c in your bank account.`);
//
// _i18n = I18n.use({locale: 'zh-Hant-CN', defaultCurrency: 'CNY', messageBundle: messageBundle_zh_Hant});
// console.log(_i18n `Hello ${name}, you have ${amount}:c in your bank account.`);