import randstr from '../../util/randstr';

it('should return a string', () => {
	const str = randstr(16);
	expect(str.length).toBe(16);
});
