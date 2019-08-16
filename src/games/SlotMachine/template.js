import s from './game.scss';
import { htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;


/**
 *
 * 创建修饰层
 * @param {Array} modify
 * @returns
 */
function renderModify(modify) {

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
	const { gameInfoPrizeImg, gameInfoPrizeName, showGameInfoButton, gameInfoWrap, gameInfo, gameInfoPrizeItem } = style;

	const showGameInfoButtonStyle = inlineStyle(showGameInfoButton);
	const gameInfoWrapStyle = inlineStyle(gameInfoWrap);
	const gameInfoStyle = inlineStyle(gameInfo);
	const gameInfoPrizeImgStyle = inlineStyle(gameInfoPrizeImg);
	const gameInfoPrizeNameStyle = inlineStyle(gameInfoPrizeName);
	const gameInfoPrizeItemStyle = inlineStyle(gameInfoPrizeItem);

	let dom = '';

	for (let index = 0; index < prizes.length; index++) {
		const element = prizes[index];
		dom += `<div class="${s.infoItem}" >
			<div class="${s.gimeinfoItem}"  ${gameInfoPrizeItemStyle ? `style="${gameInfoPrizeItemStyle}"` : ''}>
				<img ${gameInfoPrizeImgStyle ? `style="${gameInfoPrizeImgStyle}"` : ''} src="${element.gameImg || element.prizeImg}" />
				<div ${gameInfoPrizeNameStyle ? `style="${gameInfoPrizeNameStyle}"` : ''}>${element.prizeAlias || element.prizeName}</div>
			</div>
		</div>`;
	}

	return `<div class="${s.toggleprize} ${s.toggleb}" ${showGameInfoButtonStyle ? `style="${showGameInfoButtonStyle}"` : ''}>
		奖品
	</div>
	<div class="${s.prizeswrap}" ${gameInfoWrapStyle ? `style="${gameInfoWrapStyle}"` : ''}>
		<div class="${s.gameinfo}" ${gameInfoStyle ? `style="${gameInfoStyle}"` : ''}>${dom}</div>
	</div>`;
}

function renderGamePrize(style, prizes, id) {
	let dom = '';
	const { gamePrizeName, gamePrizeImg, gameItem, game} = style;
	const gamePrizeNameStyle = inlineStyle(gamePrizeName);
	const gamePrizeImgStyle = inlineStyle(gamePrizeImg);
	const gameItemStyle = inlineStyle(gameItem);
	const gameStyle = inlineStyle(game);

	for (let index = 0; index < prizes.length; index++) {
		const element = prizes[index];
		dom += `<div class="item-${id}" style="height:${(1 / prizes.length) * 100}%;">
			<div ${gameItemStyle ? `style="${gameItemStyle}"` : ''}>
				<img ${gamePrizeImgStyle ? `style="${gamePrizeImgStyle}"` : ''} src="${element.gameImg || element.prizeImg}" />
				<p ${gamePrizeNameStyle ? `style="${gamePrizeNameStyle}"` : ''} style="position: absolute; top:0">${element.prizeAlias || element.prizeName}</p>
			</div>
		</div>`;
	}

	return `<div class="slotboard-${id}" ${gameStyle ? `style="${gameStyle}"` : ''}>
		<div class="outwrap-${id}">
			<div class="slotwrap-${id}">
				${dom}
			</div>
		</div>
	</div>`;
}

/**
 *
 * 创建游戏主体
 * @export
 * @param { Object } style 卡牌皮肤
 * @param { Array } prizes 奖项
 * @returns
 */
export function renderGame(style, prizes, id) {
	const { wrap, modify, startButton } = style;
	const wrapStyle = inlineStyle(wrap);
	const startButtonStyle = inlineStyle(startButton);

	return `${modify.length > 0 ? `<div class="${s.modifywrap}">${renderModify(modify)}</div>` : ''} 
	<div class="${s.wrap}" ${wrapStyle ? `style="${wrapStyle}"` : ''}>
		${renderGameInfo(style, prizes)}
		${renderGamePrize(style, prizes, id)}
	</div>
	<button class="${s.startbtn}" ${startButtonStyle ? `style="${startButtonStyle}"` : ''}>开始游戏</button>`;
}
