import s from './game.scss';
import { htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;


/**
 *
 * 创建修饰层
 * @param {Array} modify
 * @returns
 */
function renderModify(modify){

	if (!modify || !Array.isArray(modify)) {
		return '';
	}

	let modifyDom = '';
	for (let index = 0; index < modify.length; index++) {
		const element = modify[index];
		modifyDom += `<div class="${s.modify}" style="${inlineStyle(element)}">&nbsp;</div>`;
	}

	return modifyDom;
}

function renderGameInfo(style, prizes) {

	let dom = '';

	for (let index = 0; index < prizes.length; index++) {
		const element = prizes[index];
		dom += `<div class="${s.infoItem}">
			<img src="${element.prizeImg}" />
			<div>${element.prizeAlias}</div>
		</div>`;
	}

	return `<div class="${s.gameinfo}">${dom}</div>`;
}

/**
 *
 * 创建游戏主体
 * @export
 * @param { Object } style 卡牌皮肤
 * @param { Array } prizes 奖项
 * @returns
 */
export function renderGame(style, prizes) {
	const { wrap, modify, gameImg, prizeAlias, dice, side, dot } = style;

	const gameImgStyle = inlineStyle(gameImg);
	const prizeAliasStyle = inlineStyle(prizeAlias);
	const wrapStyle = inlineStyle(wrap);
	const diceStyle = inlineStyle(dice);
	const sideStyle = inlineStyle(side);
	const dotStyle = inlineStyle(dot);

	// const setSize = {
	// 	transform: `scale(${((dice && dice.size) ? dice.size : '1')},${((dice && dice.size) ? dice.size : '1')})`
	// };

	console.log(gameImgStyle, prizeAliasStyle, prizes);

	let dom = `
	<div class="${s.ui_dado}">
		<div class="${s.platform}">
			<div class="${s.dice}" style="${diceStyle}">
				<div style="${sideStyle}" class="${s.side} ${s.front}">
					<div style="${dotStyle}" class="${s.dot} ${s.center}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.front} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.top}">
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.top} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.right}">
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.center}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.right} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.left}">
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dright}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.left} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.bottom}">
					<div style="${dotStyle}" class="${s.dot} ${s.center}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dright}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.bottom} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.back}">
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dtop} ${s.dright}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.dbottom} ${s.dright}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.center} ${s.dleft}"></div>
					<div style="${dotStyle}" class="${s.dot} ${s.center} ${s.dright}"></div>
				</div>
				<div style="${sideStyle}" class="${s.side} ${s.back} ${s.inner}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.cover} ${s.x}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.cover} ${s.y}"></div>
				<div style="${sideStyle}" class="${s.side} ${s.cover} ${s.z}"></div>
			</div>
		</div>
	</div>
	`;

	return `${modify.length > 0 ? `<div class="${s.modifywrap}">${renderModify(modify)}</div>` : ''} 
	<div class="${s.wrap}" ${wrapStyle ? `style="${wrapStyle}"` : ''}>
	${renderGameInfo(style, prizes)}
	<div class="${s.lottery}">
		${dom}
	</div> 
	</div>`;
}
