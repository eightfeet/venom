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


/**
 *
 * 创建游戏主体
 * @export
 * @param { Object } style 卡牌皮肤
 * @returns
 */
export function renderGame(style) {
	const { wrap, modify, startButton } = style;
	const wrapStyle = inlineStyle(wrap);
	const startButtonStyle = inlineStyle(startButton);
	console.log(startButtonStyle);

	return `${modify.length > 0 ? `<div class="${s.modifywrap}">${renderModify(modify)}</div>` : ''} 
	<div class="${s.wrap}" ${wrapStyle ? `style="${wrapStyle}"` : ''}>
        <div class="${s.redpack}">
			<div class="${s.topcontent}">
				<div class="${s.info}">
					<div class="${s.subtitle}">开启您的红包</div>
					<div class="${s.title}">恭喜发财，大吉大利</div>
				</div>
				<div class="${s.result}">
					<div class="${s.gameprizetag}">
					</div>
					<div class="${s.gameprizename}">
					</div>
				</div>
                <div class="${s.actionbox}">
                    <div class="${s.startbutton}">开始</div>
				</div>
			</div>
			<div class="${s.gameprize}">
			</div>
			<div class="${s.ensure}">
				确定
			</div>
        </div>   
	</div>`;
}