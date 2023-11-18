import { i17n, createi17n, InterpolatedFn } from '@src/core/create-i17n';

const lang = {
  hello: 'world',
  welcomeUser: 'Welcome, {user}!',
  welcomeUsers: 'Welcome, {user1} and {user2}!',
  withTwoOfTheSame: 'Welcome {user}, we are glad to have you, {user}.',
  user: {
    name: 'User',
  },
  global: {
    edit: 'Edit',
    buttons: {
      save: 'Save',
    },
    addNew: 'Add New {item}',
  },
  project: {
    name__one: 'Project',
    name__many: 'Projects',
  },
};

describe('createi17n', () => {
  describe('t', () => {
    let t: i17n['t'];

    beforeAll(() => {
      ({ t } = createi17n({ translations: lang }));
    });

    describe('top level keys', () => {
      it('should return a value from a top level key', () => {
        expect(t('hello')).toBe(lang.hello);
      });

      it('should return the key when the top level key does not exist', () => {
        expect(t('t')).toBe('t');
      });
    });

    describe('nested keys', () => {
      it('should return a value from a nested key', () => {
        expect(t('global.edit')).toBe(lang.global.edit);
        expect(t('global.buttons.save')).toBe(lang.global.buttons.save);
      });

      it('should return the key when the nested key does not exist', () => {
        expect(t('something.does.not.exist')).toBe('something.does.not.exist');
        expect(t('global.edit.buttons')).toBe('global.edit.buttons');
      });

      it('should return the key when the nested key is an object', () => {
        expect(t('global.buttons.edit')).toBe('global.buttons.edit');
      });

      it('should return the value passed if it does not exist', () => {
        expect(t('no.real.key')).toBe('no.real.key');
      });
    });

    describe('interpolated values', () => {
      it('should interpolate values', () => {
        expect(t('welcomeUser', { user: 'drew' })).toBe('Welcome, drew!');
        expect(t('welcomeUser', { user: 'john' })).toBe('Welcome, john!');
        expect(t('global.addNew', { item: 'Material' })).toBe('Add New Material');
        expect(t('global.addNew', { item: t('user.name') })).toBe('Add New User');
      });

      it('should interpolate multiple values', () => {
        expect(t('welcomeUsers', { user1: 'drew', user2: 'John' })).toBe('Welcome, drew and John!');
        expect(t('withTwoOfTheSame', { user: 'drew' })).toBe('Welcome drew, we are glad to have you, drew.');
      });

      it('should return the interpolated string when no proper values are passed', () => {
        expect(t('welcomeUser', { username: 'drew' })).toBe('Welcome, {user}!');
      });
    });
  });

  describe('caching', () => {
    let cache: Map<string, string | InterpolatedFn>;
    let t: i17n['t'];

    beforeEach(() => {
      cache = new Map();

      ({ t } = createi17n({ translations: lang, cache }));
    });

    it('should cache a primitive value', () => {
      const spy = jest.spyOn(cache, 'set');

      t('hello');

      expect(spy).toHaveBeenCalledWith('hello', lang.hello);
    });

    it('should cache a function value', () => {
      const spy = jest.spyOn(cache, 'set');

      t('welcomeUser', { user: 'drew' });

      expect(spy).toHaveBeenCalledWith('welcomeUser', expect.any(Function));
    });

    it('should resolve a primitive value from the cache', () => {
      const setSpy = jest.spyOn(cache, 'set');
      const getSpy = jest.spyOn(cache, 'get');

      // no cache hit
      t('user.name');

      // cache hits (4)
      t('user.name');
      t('user.name');
      t('user.name');
      t('user.name');

      expect(setSpy).toHaveBeenCalledWith('user.name', lang.user.name);
      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(4);
    });

    it('should resolve a function from the cache', () => {
      const setSpy = jest.spyOn(cache, 'set');
      const getSpy = jest.spyOn(cache, 'get');

      // no cache hit
      t('global.addNew', { item: 'One' });

      // cache hits (4)
      t('global.addNew', { item: 'Two' });
      t('global.addNew', { item: 'Three' });
      t('global.addNew', { item: 'Four' });
      t('global.addNew', { item: 'Five' });

      expect(setSpy).toHaveBeenCalledWith('global.addNew', expect.any(Function));
      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(4);
    });

    it('should hit the cache for interpolated count values', () => {
      const setSpy = jest.spyOn(cache, 'set');
      const getSpy = jest.spyOn(cache, 'get');

      // no cache hit
      expect(t('project.name', { count: 1 })).toBe(lang.project.name__one);

      // cache hits (4)
      expect(t('project.name', { count: 1 })).toBe(lang.project.name__one);
      expect(t('project.name', { count: 1 })).toBe(lang.project.name__one);
      expect(t('project.name', { count: 1 })).toBe(lang.project.name__one);
      expect(t('project.name', { count: 1 })).toBe(lang.project.name__one);

      expect(setSpy).toHaveBeenCalledWith('project.name__one', lang.project.name__one);
      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledTimes(4);
    });

    it('should not hit the cache for interpolated counts of different values', () => {
      const setSpy = jest.spyOn(cache, 'set');
      const getSpy = jest.spyOn(cache, 'get');

      // no cache hit
      t('project.name', { count: 1 });
      t('project.name', { count: 0 });

      // cache hits (3)
      expect(t('project.name', { count: 1 })).toBe(lang.project.name__one);
      expect(t('project.name', { count: 1 })).toBe(lang.project.name__one);
      expect(t('project.name', { count: 0 })).toBe(lang.project.name__many);

      expect(setSpy).toHaveBeenCalledWith('project.name__one', lang.project.name__one);
      expect(setSpy).toHaveBeenCalledWith('project.name__many', lang.project.name__many);
      expect(setSpy).toHaveBeenCalledTimes(2);
      expect(getSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('count based', () => {
    const langWithCounts = {
      comment__one: 'Comment',
      comment__many: 'Comments',

      project: {
        name__one: 'Project',
        name__many: 'Projects',
      },

      user: 'User',
    };
    let t: i17n['t'];

    beforeAll(() => {
      ({ t } = createi17n({ translations: langWithCounts }));
    });

    it('should find the the _one key when the count is one', () => {
      expect(t('comment', { count: 1 })).toBe(langWithCounts.comment__one);
    });

    it('should find the _many key when the number is 0', () => {
      expect(t('comment', { count: 0 })).toBe(langWithCounts.comment__many);
    });

    it('should find the _many key when the number is greater than 1', () => {
      expect(t('comment', { count: 10 })).toBe(langWithCounts.comment__many);
    });

    it('should resolve to the key passed when there is a count and no count based interpolations', () => {
      expect(t('user', { count: 10 })).toBe(langWithCounts.user);
    });

    describe('nested', () => {
      it('should find the the _one key when the count is one', () => {
        expect(t('project.name', { count: 1 })).toBe(langWithCounts.project.name__one);
      });

      it('should find the _many key when the number is greater than 1', () => {
        expect(t('project.name', { count: 10 })).toBe(langWithCounts.project.name__many);
      });

      it('should resolve to the key passed when there is a count and no count based interpolations', () => {
        expect(t('project.name', { count: 10 })).toBe(langWithCounts.project.name__many);
      });
    });
  });

  describe('extend', () => {
    let t: i17n['t'];
    let extend: i17n['extend'];

    beforeAll(() => {
      ({ t, extend } = createi17n({ translations: lang }));

      extend({
        aNewKey: 'here',
        aNewInterpolated: 'a {new} one',
        aNewWithCount__one: 'singular',
        aNewWithCount__many: 'plural',
        a: {
          newNested: {
            item: 'a new nested item',
          },
        },
        global: {
          save: 'Save {item}',
          buttons: {
            edit: 'Edit',
          },
        },
      });
    });

    it('should have the keys once extended', () => {
      expect(t('aNewKey')).toBe('here');
      expect(t('aNewInterpolated', { new: 'newer' })).toBe('a newer one');
      expect(t('aNewWithCount', { count: 1 })).toBe('singular');
      expect(t('aNewWithCount', { count: 2 })).toBe('plural');
      expect(t('a.newNested.item', { count: 2 })).toBe('a new nested item');
      expect(t('global.save', { item: 'foo' })).toBe('Save foo');
      expect(t('global.buttons.edit')).toBe('Edit');
    });

    it('should preserve the previous keys', () => {
      expect(t('hello')).toBe(lang.hello);
      expect(t('global.buttons.save')).toBe(lang.global.buttons.save);
      expect(t('welcomeUser', { user: 'drew' })).toBe('Welcome, drew!');
      expect(t('global.addNew', { item: t('user.name') })).toBe('Add New User');
    });
  });
});
