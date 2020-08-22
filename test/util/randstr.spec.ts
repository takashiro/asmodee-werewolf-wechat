import randstr from '../../src/util/randstr';

it('should return a string', () => {
	const str = randstr(16);
	expect(str.length).toBe(16);
});
