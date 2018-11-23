<!-- bug, 把closePage设为true, page-size依旧生效 -->
<template>
	<transition name="fade" mode="out-in">
		<div class="base-table-container">
			<!-- ● loading -->
			<div class="loading-container" v-if="loading">
				<base-loading v-if="loading"></base-loading>
			</div>
			<!-- ●table -->
			<div class="base-table" ref="baseTable" v-show="!loading">	
				<!-- ○表头: 下载 -->
				<i-button id="download" type="success" size="small" @click="downloadExcel" :loading="ifShowDownloading">
					<Icon <Icon type="arrow-down-a"></Icon> {{$t('download')}}
				</i-button>
				<!-- ○表头: slot -->
				<slot name="table-head"></slot>
				<!-- ○表身: slot -->
				<el-table :data="pageData" border :stripe="!closeStripe" ref="elTable">
					<!-- ■ 插槽: 表格主体 -->
					<slot name="table" :pageData="pageData">
						<el-table-column v-for="(f, fIndex) in calculatedTableFields" :prop="f" :label="$t(f)" :min-width="colWidths[fIndex]" :key="f">
							<template scope="table" >
								<div v-if="innerHtml" v-html="table.row[f]"></div>
								<div v-else>{{table.row[f]}}</div>
							</template>
						</el-table-column>
					</slot>
					<!-- ■ 插槽: 表格的最后一行 -->
					<slot name="table-after"  :pageData="pageData">
					</slot>
				</el-table>
				<!-- ●page -->
				<Page 
					id="page" 
					v-if="!closePage" 
					:total="_pageTotal" 
					size="small"
					show-total
					:page-size="pageSize" 
					:current="currentPageNum" 
					@on-change="changeTablePage"
					>
				</Page>
				<!-- ●工具: 长描述提示框 -->
				<base-tooltip :content="tooltipContent" :relatedEl="this.tooltipRelatedEl"></base-tooltip>
				<div class="long-des-icon">?</div> <!-- 拥有提示框的标志 -->
			</div>
		</div>	
	</transition>
</template>
<script>
	import baseTooltip from '@/components/base-tooltip/index.vue';	// 悬浮提示插件
	import jsonTree from '@/assets/vendor/json-tree.js';	// json-tree插件
	import baseLoading from '@/components/base-loading/index.vue';
	import _ from 'lodash';

	export default {
		name: 'base-table',
		components: {baseTooltip, baseLoading},
		data () {return {
			pageData: [],				// 当前页数据
			_pageTotal: 0,				// 当前page组件的total属性的值, 即page被告知的总条数, page根据总条数来形成页数. 在启动liveLoad动态加载时, 这个总条数可能是虚的, 即有些页面并无对应的数据, 需要动态进行加载
			currentPageNum: 1,			// 当前位于的分页, 只控制视觉效果
			colWidths: [],				// 列宽, 每次传入数据, 都会根据传入数据的长度重新计算列宽
			ifShowDownloading: false,	// 下载为excel, 是否显示下载中
			// ●工具: tooltip
			tooltipContent: null,		// tooltip显示的内容
			tooltipRelatedEl: null,		// tooltip相对的元素
		};},
		props: {
			tableData: Array,				// 表格数据
			tableFields: Array,				// 表格字段, 如果不传入, 则表示动态读取并渲染字段. 可以用于限制显示的字段
			closeLongDes: Boolean,			// 是否关闭长描述, 默认开启, 对应多顶栏的表格需要手动关闭. 注意需要现在mounted中启用longDes功能
			closePage: Boolean,				// 是否关闭分页, 默认开启分页		
			closeStripe: Boolean,			// 是否关闭隔行高亮, 默认开启
			closeColHighlight: Boolean,		// 是否关闭列高亮. 对应多顶栏的表格需要手动关闭. 注意需要现在mounted中启用colHighLight功能
			innerHtml: Boolean,				// 是否以innerHtml的形式, 而非文本的形式, 显示表格中的内容
			jsonTree: String,				// 对哪些单元格启用jsonTree. 传入一个jquery搜索标志符. 如#div1. 注意, 使用jsonTree前, 必须启用innerHtml
			loading: Boolean,				// 是否正在加载, 是否显示正在加载动画
			liveLoadByPage: Boolean,		// 是否启用换页时动态加载数据, 默认关闭. 如果启用, 则换页时会发送一个onPageChage事件给父元素. 动态加载逻辑尚未完成. 需要liveLoad, pageTotal以及on-page-change的配合
			pageTotal: Number,				// 用于page的total属性. 开始动态加载时, pageTotal使用这个属性来计算总共显示的页数
			pageSize: {						// 分页大小. 不传入则默认10
				type: Number,
				default: 10
			},				
		},
		computed: {
			// ● 自动计算表字段. 如果没有传入tableFields, 则自己计算出tableFields, 放在这里
			calculatedTableFields () {
				let res = [];				
				if (this.tableData.length>0 && !this.tableFields) {
					for (let p in this.tableData[0]) {
						res.push(p);
					}
				} else if (this.tableFields) {
					res = this.tableFields;
				}
				
				return res;
			}
		},
		watch: {
			tableData: {	
				deep: true,
				immediate:true,							// 第一次接收到数据时就触发. 默认watch只在第二次接收到数据时启动. 这里改变了默认行为
				handler () {
					if (_.isArray(this.tableData)) {
						this._pageTotal = this.liveLoadByPage&&this.pageTotal ? this.pageTotal : this.tableData.length;  // 如果是按页动态加载, 在page的total属性不能根据实际的tableData的length来决定, 而应该根据传入的pageTotal来决定
						this.ifNormalize();
						if (this.tableData.length>0) {
							this.calIfShowPage();	// 计算分页
							this.calColWidth();		// 分配单元格宽度
							this.buildJsonTree();	// 启用json tree功能
							this.colHighlight();	// 启用列高亮
							this.showDetailDescription();	// 启用th悬浮解释功能
						}
					} 
				}
			}
		},
		methods: {
			// ● 校验: 是否是合法的表格数据, 合法的表格数据, 每一行的属性必须一样
			ifNormalize () {
				// ○ 校验
				if (!this.tableData.length) {
					return;
				}
				// ○ 计算是否需要normalize
				let allProps = [];
				let eachPropsNum = [];
				let firstPropsNum;
				let i = 0;
				for (let d of this.tableData) {
					let props = Object.keys(d);
					allProps = allProps.concat(props);
					eachPropsNum.push(props.length);
					if (i === 0) {
						firstPropsNum = props.length
					}
					i++;
				}
				let allPropsLength = eachPropsNum.reduce((pre, cur) => pre + cur);
				// ○ if normalize
				allProps = Array.from(new Set(allProps));
				if (!(allPropsLength / eachPropsNum.length === firstPropsNum)) {
					console.error('base-table, ifNormalize, 传入的tableData不合法, 每一行的数据不一样长', this.tableData);
				}
			},
			// ● 分页: 计算是否显示分页器. 每次tableData改变时都会触发
			calIfShowPage () {
				if (this.closePage) {
					this.pageData = this.tableData;
				}else if (!this.closePage && this._pageTotal <= this.pageSize) {
					this.pageData = this.tableData;
				} else {
					this.changeTablePage(1);	// 否则计算分页
				}					
				setTimeout(()=>{
					this.currentPageNum = 1;
				}, 500);					// 自动还原页面至1
			},
			// ●分页: 改变表格分页. 每次tableData改变时, 点击分页器时都会触发
			changeTablePage (pageNum) {
				this.currentPageNum = pageNum;
				this.pageData = this.tableData.slice((pageNum-1)*this.pageSize, pageNum*this.pageSize);
				this.$utils.highlight();		// 重新着色
			},
			// ●列宽: 根据列字符数, 重新计算列宽
			calColWidth () {
				let colWidths = [];
				let sampleData = _.cloneDeep(this.tableData[0]);
				for (let p in sampleData) {
					let width;
					if (typeof sampleData[p] === 'string') {
						sampleData[p] = sampleData[p].replace(/\s*||\\*/g, '')
						width = sampleData[p].length * 14;
					} else if (sampleData[p]) {
						width = JSON.stringify(sampleData[p]).length * 14;
					}
					width = width < 100 ? 100 : width;	// 最小宽度
					width = width > 400 ? 400 : width;	// 最大宽度
					colWidths.push(width);
				}
				this.colWidths = colWidths;
			},
			// ●功能: 下载excel
			downloadExcel () {
				this.ifShowDownloading = true;		// 下载按钮显示等待
				// ○计算表头: 通过this.tableFields
				let excelData = [];
				let translatedTableFields = [];
				this.calculatedTableFields.forEach((f, fIndex)=>{
					translatedTableFields.push(this.$t(f));
				});
				excelData.push(translatedTableFields)

				// ○ 计算表身: this.tableData
				// ○ 当前算法必须保证每行的属性必须一样, 且一一对应
				this.tableData.forEach((row)=>{
					let arr = [];
					for (let prop of this.calculatedTableFields) {
						arr.push(row[prop]);
					}
					excelData.push(arr);
				})
				
				// ○下载
				let fileName = this.$t(this.$route.path.split('/')[2]);
				this.$utils.excelMaker(excelData, fileName);
				this.ifShowDownloading = false;	// 下载按钮关闭等待
			},
			// ●功能: toolTip: show detailed description on hover on th
			showDetailDescription () {
				if (this.closeLongDes) {return;}
				setTimeout(()=>{
					// ○根据lang.js, 计算出拥有长描述的td
					let divs = this.$jquery('th div', this.$refs['baseTable']);
					let longDesIcon = document.getElementsByClassName('long-des-icon')[0];	// 拥有长描述的icon
					let longLang = localStorage.getItem('lang')+'l';	// 长描述存储在lang.js中, 当前语言+l的字段下, 如cn: 中文短描述, cnl: 中文长描述
					if (this.$refs['elTable'] && Array.isArray(this.$refs['elTable'].columns)) {
						this.$refs['elTable'].columns.forEach((col, cIndex)=>{	// 根据el-table这个vue组件中columns属性中的值, 查看每个td对应的prop. 注意: 多重顶栏时会计算出错
							divs[cIndex].parentNode.setAttribute('data-prop', col.property);
							let longLangStr = this.$t(col.property, longLang);
							if (longLangStr.toLowerCase() !== col.property.toLowerCase()) {	// 如有有长描述
								divs[cIndex].parentNode.classList.add('has-long-des');	// 添加class
								let cloneLongDesIcon = longDesIcon.cloneNode(true);
								cloneLongDesIcon.style.visibility = 'visible';
								divs[cIndex].appendChild(cloneLongDesIcon);				// 添加拥有长描述的icon
							}
						});
						// ○悬浮式显示长描述
						this.$jquery('.has-long-des', this.$refs['baseTable'])
							.hover(
								(e)=>{	// 悬浮式, 通过改变传入base-tooltip组件的值, 显示长描述
									this.tooltipRelatedEl = e.currentTarget;
									this.tooltipContent = this.$t(e.currentTarget.getAttribute('data-prop'), longLang);
								},
								(e)=>{
									this.tooltipRelatedEl = null;	// mouseleave时关闭长描述
								}
							)
					}
				}, 100);
			},
			// ●功能: 表格列高亮
			colHighlight () {
				if (!this.closeColHighlight) {
					setTimeout(()=>{
						let table = this.$refs['baseTable'];						
						this.$jquery('td, th', table).hover((e)=>{
							for (let tdNum in e.currentTarget.parentNode.childNodes) {
								if (e.currentTarget.parentNode.childNodes[tdNum] === e.currentTarget) {
									this.$jquery('td, th',table).removeClass('highlight');
									this.$jquery(`tr>td:nth-child(${Number(tdNum)+1})`,table).addClass('highlight')
									this.$jquery(`tr>th:nth-child(${Number(tdNum)+1})`,table).addClass('highlight')
									break;
								}
							}
						})
						table.onmouseleave = () => {	// 移出table时取消所有高亮, 使用不冒泡的leave
							this.$jquery('td, th',table).removeClass('highlight');
						}
					}, 0);
				}
			},
			// ●功能: 启动jsonTree
			buildJsonTree () {
				// jsonTree.create
				if (!this.jsonTree) {return;}
				if (this.jsonTree && !this.innerHtml) {throw new Error('要启用jsonTree, 但未启用innerHtml'); return;}
				setTimeout(()=>{
					let trees = this.$jquery('.json-tree');
					for (let i=0; i<trees.length; i++) {
						let json = trees[i].innerText;
						trees[i].innerText = '';
						jsonTree.create(JSON.parse(json), trees[i]);
					}
				}, 0);
			}
		},
		mounted () {
		}
	}
</script>
<style lang="scss" scoped>
	.loading-container {
		background: #fff;
		padding: 140px;
		transition: all 0.2s;
		margin: 20px 0px;
	}
	.base-table {
		margin-bottom: 80px;
	}
	#page {
		float: right;
		margin-top: 4px;
	}
	#download {
		float: right;
		margin-bottom: 10px;
	}
	/* ●拥有长描述的标志*/
	.long-des-icon {
		display: inline-block;
		visibility: hidden;
		width: 12px;
		height: 12px;
		line-height: 12px;
		background: #999!important;
		border-radius: 20px;
		text-align: center;
		font-size: 8px;
		color: #fff;
		vertical-align: 2px;
		margin-left: 4px;
	}
</style>