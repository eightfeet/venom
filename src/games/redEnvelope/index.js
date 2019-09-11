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
		const { style, prizes, targetId, parentId, emBase, onCancel, onEnsure, saveAddress } = config;
		this.targetId = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random() * 100)}`;
		this.emBase = emBase;
		this.prizes = prizes;
		this.GameTheme = style.GameTheme;
		this.parentId = parentId;
		this.core = new Core({
			...config,
			onCancel: this.onCancel(onCancel),
			onEnsure: this.onEnsure(onEnsure),
			saveAddress: this.onSaveAddress(saveAddress),
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
		this.disableReset = false;
		this.config = config;
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

	reset = () => {
		if (this.disableReset) {
			return;
		}
		const startbtn = this.target.querySelector(`.${s.startbutton}`);
		const topcontent = this.target.querySelector(`.${s.topcontent}`);
		const redpack = this.target.querySelector(`.${s.redpack}`);
		const info = this.target.querySelector(`.${s.info}`);

		const result = this.target.querySelector(`.${s.result}`);
		const gameprize = this.target.querySelector(`.${s.gameprize}`);

		const gamememo = this.target.querySelector(`.${s.memo}`);

		topcontent.classList.remove(s.topcontentopen);
		redpack.classList.remove(s.redpackopen);
		const ensurebtn = this.target.querySelector(`.${s.ensure}`);
		startbtn.classList.remove(s.hide);
		info.classList.remove(s.hide);

		result.classList.add(s.hide);
		ensurebtn.classList.add(s.hide);
		gameprize.classList.add(s.hide);
		gamememo.classList.add(s.hide);

	}


	forceReset = () => {
		this.disableReset = true;
		this.reset();
		this.disableReset = false;
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
		const ensurebtn = this.target.querySelector(`.${s.ensure}`);
		const topcontent = this.target.querySelector(`.${s.topcontent}`);
		const redpack = this.target.querySelector(`.${s.redpack}`);
		const gameprize = this.target.querySelector(`.${s.gameprize}`);
		const result = this.target.querySelector(`.${s.result}`);
		const info = this.target.querySelector(`.${s.info}`);
		const prizeName = result.querySelector(`.${s.gameprizename}`);
		const gameawardmsg = result.querySelector(`.${s.gameawardmsg}`);
		const gamememo = this.target.querySelector(`.${s.memo}`);

		startbtn.classList.add(s.rotate);

		Promise.resolve()
			.then(() => dormancyFor(1500))
			.then(() => {
				prizeName.innerHTML = `${prize.prizeName}`;
				gameawardmsg.innerHTML =  `${prize.awardMsg}`;
				if (prize.receiveType === 2) {
					ensurebtn.innerHTML = `${this.core.SuccessModal.submitAddressText}`;
				} else {
					ensurebtn.innerHTML = `${this.core.SuccessModal.submitText}`;
				}

				
				startbtn.classList.remove(s.rotate);

				startbtn.classList.add(s.hide);
				info.classList.add(s.hide);
				redpack.classList.add(s.redpackopen);
				topcontent.classList.add(s.topcontentopen);
				gameprize.innerHTML = `<img src="${prize.prizeImg}" />`;
				gamememo.innerHTML = prize.memo;
				onceTransitionEnd(redpack)
					.then(() => {
						result.classList.remove(s.hide);
						gameprize.classList.remove(s.hide);
						gamememo.classList.remove(s.hide);
						
						ensurebtn.classList.remove(s.hide);
						ensurebtn.onclick = () => {
							if (prize.receiveType === 2) {
								this.core.handleSaveAddress(() => this.onEnsure(this.config.onEnsure)(prize));
							} else {
								this.onEnsure(this.config.onEnsure)(prize);
							}
						};
						
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
		this.reset();
	}

	/**
	 *
	 * @param { function } cancel
	 * @memberof Game
	 */
	onEnsure = (ensure) => (prize) => {
		ensure && ensure(prize);
		if (prize.receiveType !== 2) {
			this.reset();
		}
	}

	/**
	 * 保存地址成功后重置游戏
	 * @param { Function } saveAddress 承接保存地址方法
	 * @memberof Game
	 */
	onSaveAddress = (saveAddress) => (data) => {
		if (saveAddress && typeof saveAddress === 'function') {
			return saveAddress(data)
				.then(() => {
					this.reset();
				});
		}
		return () => {
			throw '无保存地址方法, 确保方法new Promise & resolve';
		};
	}
	
}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};
