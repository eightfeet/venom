if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

import Core from '../Core';
import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;

import { renderGame } from './template';
import s from './game.scss';

const stamp = (new Date()).getTime();


// 设定必要初始值
const stepX = 16.66666;
const stepY = 25;

const Arr = {
	1: [[1,2]],
	2: [[1,1],[1,3]],
	3: [[1,1],[1,3],[2,2]],
	4: [[1,1],[1,3],[2,1],[2,3]],
	5: [[1,0],[1,2],[1,4],[2,1],[2,3]],
	6: [[1,0],[1,2],[1,4],[2,0],[2,2],[2,4]]
};
// let timer = null;
// let timerB = null;

// let oldStyle = null;

// const stamp = (new Date()).getTime();
// /**
//  *
//  * 洗牌工具
//  * @param { Array } arr
//  * @returns
//  */
// function KdShuffle(arr){
// 	let len = arr.length,
// 		i,temp;
// 	while (len){
// 		i = Math.floor(Math.random() * len--);
// 		temp = arr[i];
// 		arr[i] = arr[len];
// 		arr[len] = temp;
// 	}
// 	return arr;
// }

class Game {
	constructor(config){
		const { style, prizes, targetId } = config;
		this.targetId = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random() * 100)}`;
		
		this.prizes = prizes;
		this.GameTheme = style.GameTheme;

		this.game = new Core({...config, targetId: this.targetId, lotteryForms: {
			template: this.renderGame()(),
			launcher: `.${s.wrap}`,
			action: this.lottery
		}});
		this.Loading = this.game.Loading;
	}
	lottery = () => new Promise(resolve => {
		resolve();
	});

	renderGame = () => {
		const prizesLength = this.prizes.length;
		const itemPosition = Arr[prizesLength];
		renderGame(
			this.GameTheme,
			this.prizes,
			`${this.targetId}_items`
		).then(() => {
			const target = document.getElementById(this.targetId);
			target.classList.add(s.target);
			// return dormancyFor(200);
		})
			.then(() => {
				const target = document.getElementById(this.targetId);
				const items = target.querySelector(`.${s.wrap}`).children;
				for (let index = 0; index < items.length; index++) {
					const element = items[index];
					element.style.left = `${itemPosition[index][1]*stepX}%`;
					element.style.top = `${itemPosition[index][0] === 1 ? 0 : stepY*2}%`;
					element.children[0].onclick = e => {
						return this.lottery(index, e);
					};
				}
			});
	}

}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};