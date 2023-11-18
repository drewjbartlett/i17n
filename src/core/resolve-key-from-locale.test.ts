import { resolveKeyFromLocale } from '@src/core/resolve-key-from-locale';

const lang = {
  hello: 'world',
  global: {
    edit: 'Edit',
    buttons: {
      save: 'Save',
    },
  },
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const t = (k: string) => resolveKeyFromLocale(k, lang);

describe('resolveKeyFromLocale', () => {
  describe('top level', () => {
    it('should return a value from a top level key', () => {
      expect(t('hello')).toBe(lang.hello);
    });

    it('should return null when the top level key does not exist', () => {
      expect(t('t')).toBeNull();
    });
  });

  describe('nested strings', () => {
    it('should return a value from a nested key', () => {
      expect(t('global.edit')).toBe(lang.global.edit);
      expect(t('global.buttons.save')).toBe(lang.global.buttons.save);
    });

    it('should return null when the nested key does not exist', () => {
      expect(t('something.does.not.exist')).toBeNull();
      expect(t('global.edit.buttons')).toBeNull();
    });

    it('should return null when the nested key is an object', () => {
      expect(t('global.buttons.edit')).toBeNull();
    });
  });
});
