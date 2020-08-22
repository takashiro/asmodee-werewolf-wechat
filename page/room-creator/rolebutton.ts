Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		role: {
			type: Number,
			value: 0,
		},
		icon: {
			type: String,
			value: 'werewolf',
		},
		name: {
			type: String,
			value: 'Takashiro',
		},
		selected: {
			type: Boolean,
			value: false,
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		handleTap() {
			const selected = !this.data.selected;
			this.setData({ selected: selected });
			this.triggerEvent('numberchange', {
				role: this.data.role,
				value: selected ? 1 : 0,
			});
		},
	},
});
