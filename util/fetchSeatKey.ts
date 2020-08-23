import randstr from './randstr';

function readSeatKey(): Promise<string> {
	return new Promise((resolve, reject) => {
		wx.getStorage({
			key: 'seatKey',
			success(res) {
				if (res && typeof res.data === 'string') {
					resolve(res.data);
				} else {
					resolve('');
				}
			},
			fail: reject,
		});
	});
}

function writeSeatKey(seatKey: string): Promise<void> {
	return new Promise((resolve, reject) => {
		wx.setStorage({
			key: 'seatKey',
			data: seatKey,
			success: () => resolve(),
			fail: reject,
		});
	});
}

export default async function fetchSeatKey(): Promise<string> {
	let seatKey = '';
	try {
		seatKey = await readSeatKey();
	} catch (error) {
		// Ignore
	}

	if (seatKey) {
		return seatKey;
	}

	seatKey = randstr(16);
	await writeSeatKey(seatKey);

	return seatKey;
}
