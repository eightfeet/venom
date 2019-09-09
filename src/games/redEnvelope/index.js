if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory, tools, webAnimation } from '@byhealth/walle';
import s from './game.scss';
const { dormancyFor } = tools;
const { createDom, inlineStyle } = htmlFactory;
const { onceTransitionEnd } = webAnimation;

import { renderGame } from './template';

const stamp = (new Date()).getTime();

class Game {
	constructor(config) {
		const { style, prizes, targetId, parentId, emBase, onCancel, onEnsure } = config;
		this.targetId = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random() * 100)}`;
		this.emBase = emBase;
		this.prizes = prizes;
		this.GameTheme = style.GameTheme;
		this.parentId = parentId;
		this.core = new Core({
			...config,
			onCancel: this.onCancel(onCancel),
			onEnsure: this.onEnsure(onEnsure),
			lottery: this.lottery,
			targetId: this.targetId
		});
		this.Loading = this.core.Loading;

		this.target = null;
		this.itemHeight = null;
		this.wrapHeight = null;
		this.prizesRepeats = 6; // 每组奖品重复的次数
		this.repeats = 1;
		this.gamePrizes = [];

		this.renderGame();
	}

	reset = () => {
		const startbtn = this.target.querySelector(`.${s.startbutton}`);
		const topcontent = this.target.querySelector(`.${s.topcontent}`);
		const redpack = this.target.querySelector(`.${s.redpack}`);
		const info = this.target.querySelector(`.${s.info}`);
		// const ensure = this.target.querySelector(`.${s.ensure}`);
		startbtn.classList.remove(s.rotate);
		topcontent.classList.remove(s.topcontentopen);
		redpack.classList.remove(s.redpackopen);
		topcontent.classList.remove(s.topcontentopen);
		info.innerHTML = '';
		info.style.display = 'none';
		startbtn.style.display = 'block';
	}
    
	/**
	 *
	 * 初始化红包
	 * @memberof Game
	 */
	renderGame = () => {
		return createDom(
			renderGame(
				this.GameTheme,
				this.prizes,
				this.targetId
			),
			this.targetId,
			this.parentId,
			this.emBase
		)
			.then(() => {
				this.target = document.getElementById(this.targetId);
				// targer 自身的样式无法通过配置控制
				this.target.classList.add(s.target);
				return dormancyFor(50);
			})
			.then(() => {
				const startbtn = this.target.querySelector(`.${s.startbutton}`);
				startbtn.onclick = () => this.core.lottery();
			});
	}


	/**
	 *
	 * 开始抽奖
	 * @param {Object} prize 所获奖品
	 * @returns
	 * @memberof Game
	 */
	lottery = (prize) => new Promise((resolve) => {
		const startbtn = this.target.querySelector(`.${s.startbutton}`);
		const topcontent = this.target.querySelector(`.${s.topcontent}`);
		const redpack = this.target.querySelector(`.${s.redpack}`);
		const gameprize = this.target.querySelector(`.${s.gameprize}`);
		const result = this.target.querySelector(`.${s.result}`);
		const info = this.target.querySelector(`.${s.info}`);
		startbtn.classList.add(s.rotate);
		Promise.resolve()
			.then(() => dormancyFor(1500))
			.then(() => {
				result.querySelector(`.${s.gameprizename}`).innerHTML = `${prize.prizeName}`;
				result.style.display = 'block';
				startbtn.style.display = 'none';
				info.style.display = 'none';
				redpack.classList.add(s.redpackopen);
				topcontent.classList.add(s.topcontentopen);
				onceTransitionEnd(redpack)
					.then(() => {
						gameprize.innerHTML = `<img src="${prize.prizeImg}" />`;
						gameprize.style.display = 'block';
						const ensure = this.target.querySelector(`.${s.ensure}`);
						ensure.onclick = () => this.core.SuccessModal.onEnsure(prize);
					})
					.then(() => dormancyFor(50))
					.then(() => resolve(prize));
			});
	});

	/**
	 *
	 * @param { function } cancel
	 * @memberof Game
	 */
	onCancel = (cancel) => () => {
		cancel && cancel();
		// this.reset();
	}

	/**
	 *
	 * @param { function } cancel
	 * @memberof Game
	 */
	onEnsure = (ensure) => (prize) => {
		if (prize.receiveType === 2) {
			this.core.AddressModal.showModal(this.core.saveAddress);
		} else {
			ensure && ensure();
		}
	}
	
}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};

