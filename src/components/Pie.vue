<template>
  <div class="pie">
    <div id="pic-node">
      <section class="info">
        <h1 class="info-title">{{ formData.mainTitle }}</h1>
        <h2 class="sub-title">{{ formData.subTitle }}</h2>
        <hr style="width: 300px; margin: 0 0 10px 60px" />
        <hr style="width: 300px; margin: 0 0 10px 0" />
        <ul
          class="decks"
          v-for="(deck, index) in this.option.series[0].data"
          :key="index"
        >
          <div class="deck-item">
            <span class="deck-num">{{ deck.value }}</span
            >{{ deck.name }}
          </div>
        </ul>
      </section>

      <v-chart class="chart" :option="option" />
    </div>

    <el-dialog
      class="pie-dialog"
      title="请输入数据"
      :visible.sync="dialogVisible"
      width="80%"
      center
    >
      <el-form
        class="pie-form"
        :model="formData"
        ref="formData"
        label-width="130px"
        :rules="rules"
        size="mini"
      >
        <el-form-item label="赛事标题名称" prop="mainTitle">
          <el-input v-model="formData.mainTitle"></el-input>
        </el-form-item>

        <el-form-item label="副标题">
          <el-input v-model="formData.subTitle"></el-input>
        </el-form-item>

        <div
          class="deck-list"
          v-for="(deck, index) in formData.decks"
          :key="deck.key"
        >
          <el-form-item
            :label="'卡组' + ' ' + (index + 1) + ' ' + '类型'"
            :prop="`decks.${index}.deckType`"
            :rules="rules.deckType"
          >
            <el-select
              v-model.trim="deck.deckType"
              allow-create
              filterable
              default-first-option
              placeholder="选择卡组，可查询自定义"
            >
              <el-option
                v-for="item in deckOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="'卡组' + ' ' + (index + 1) + ' ' + '数量'"
            :prop="`decks.${index}.deckNum`"
            :rules="rules.deckNum"
          >
            <el-input
              class="deck-input"
              v-model.number="deck.deckNum"
              placeholder="请输入数量"
            ></el-input>
            <el-button type="danger" @click.prevent="removeDeck(deck)"
              >删除</el-button
            >
          </el-form-item>
        </div>
        <div class="btn-box">
          <el-button type="primary" @click="addDeck">新增卡组</el-button>
          <el-button
            class="btn-right"
            type="success"
            @click="submitForm('formData')"
            >提交</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <el-dialog
      class="pic-dialog"
      title="截图预览"
      :visible.sync="picDialogVisible"
      width="90%"
      center
    >
      <div id="pic-result"></div>

      <div class="btn-box">
        <el-button type="primary" @click="picDialogVisible = false"
          >再改改</el-button
        >
        <el-button class="btn-right" type="success" @click="savePic"
          >保存图片</el-button
        >
      </div>
    </el-dialog>

    <a class="bounce-btn" @click="dialogVisible = true">
      <span>输入数据</span>
    </a>
    <a class="save-btn" @click="preview">
      <span>截图保存</span>
    </a>
  </div>
</template>

<script>
import domtoimage from 'dom-to-image'
import { saveAs } from 'file-saver'

export default {
  name: 'Pie',
  data () {
    const validateDeckNum = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('数量不能为空'))
      } else if (/\D/.test(value)) {
        callback(new Error('请输入数字'))
      } else if (value <= 0) {
        callback(new Error('数量应大于0'))
      } else {
        callback()
      }
    }
    const validateDeckType = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('卡组不能为空'))
      } else if (this.isDeckTypeEqual(value)) {
        callback(new Error('卡组已经存在'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      picDialogVisible: false,
      typeCount: 0,
      formData: {
        mainTitle: '第13届游戏王世界赛',
        subTitle: '环境分布',
        decks: [
          {
            deckType: '',
            deckNum: 1,
            key: Date.now()
          }
        ],
        others: [
          {
            deckType: '',
            deckNum: 1,
            key: Date.now()
          }
        ]
      },
      rules: {
        mainTitle: [
          {
            required: true,
            message: '请输入标题名',
            trigger: 'blur'
          }
        ],
        deckType: [
          {
            required: true,
            message: '请输入卡组名',
            trigger: 'blur'
          },
          {
            type: 'string',
            message: '请输入字符串',
            trigger: 'blur'
          },
          { validator: validateDeckType, trigger: 'blur' }
        ],
        deckNum: [
          {
            required: true,
            message: '请输入卡组数量',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '请输入数字',
            trigger: 'blur'
          },
          { validator: validateDeckNum, trigger: 'blur' }
        ]
      },
      deckOptions: [
        {
          value: 'Others',
          label: 'Others'
        },
        {
          value: '电脑堺',
          label: '电脑堺'
        },
        {
          value: '铁兽战线',
          label: '铁兽战线'
        },
        {
          value: '影依',
          label: '影依'
        },
        {
          value: '码语者',
          label: '码语者'
        },
        {
          value: '龙女仆',
          label: '龙女仆'
        },
        {
          value: '雷龙',
          label: '雷龙'
        },
        {
          value: '@火灵天星',
          label: '@火灵天星'
        },
        {
          value: '十二兽',
          label: '十二兽'
        },
        {
          value: '黄金国',
          label: '黄金国'
        },
        {
          value: '闪刀姬',
          label: '闪刀姬'
        },
        {
          value: '自奏圣乐',
          label: '自奏圣乐'
        },
        {
          value: '龙辉巧',
          label: '龙辉巧'
        },
        {
          value: '幻影骑士团',
          label: '幻影骑士团'
        },
        {
          value: '魔救',
          label: '魔救'
        },
        {
          value: '魔术师',
          label: '魔术师'
        },
        {
          value: 'METABEAT',
          label: 'METABEAT'
        },
        {
          value: '电子龙',
          label: '电子龙'
        },
        {
          value: '调皮宝贝',
          label: '调皮宝贝'
        },
        {
          value: '抒情歌鸲',
          label: '抒情歌鸲'
        },
        {
          value: '英雄',
          label: '英雄'
        },
        {
          value: '神数',
          label: '神数'
        },
        {
          value: '恩底弥翁',
          label: '恩底弥翁'
        },
        {
          value: '转生炎兽',
          label: '转生炎兽'
        }
      ],
      option: {
        series: [
          {
            name: 'Deck Info',
            type: 'pie',
            radius: '90%',
            center: ['50%', '50%'],
            data: [
              { value: 33, name: '电脑堺' },
              { value: 24, name: '十二兽' },
              { value: 21, name: '黄金国' },
              { value: 18, name: '闪刀姬' },
              { value: 16, name: '龙女仆' },
              { value: 13, name: '龙辉巧' },
              { value: 30, name: 'Others' }
            ],
            label: {
              position: 'outer',
              alignTo: 'labelLine',
              bleedMargin: 0,
              color: '#f3f9f1',
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'Helvetica',
              formatter: function (data) { return data.name + '\n' + data.percent.toFixed(1) + '%' }
            },
            labelLine: {
              lineStyle: {
                color: '#f3f9f1'
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                borderWidth: 2,
                borderColor: '#f3f9f1'
              }
            },
            itemStyle: {
              borderWidth: 2,
              borderColor: '#f3f9f1'
            }
          }
        ],
        color: [
          '#ffd951',
          '#d9d9d9',
          '#b87333',
          '#50616d',
          '#2792c3',
          '#91cc75',
          '#ee6666',
          '#e0ebaf',
          '#cc7eb1',
          '#89c3eb',
          '#bbbcde',
          '#fce2c4',
          '#f3bf88',
          '#7ebea5',
          '#028760',
          '#f8b500',
          '#698aab',
          '#e95295',
          '#d4dcda',
          '#badcad',
          '#0094c8',
          '#aa96da',
          '#11999e',
          '#f6416c',
          '#444f5a',
          '#f07b3f',
          '#ffcef3',
          '#a9eee6',
          '#dde7f2',
          '#f73859',
          '#fff6f6'
        ]
      }
    }
  },
  mounted () {
    this.sortSelectOptions()
  },
  methods: {
    isDeckTypeEqual (value) {
      this.typeCount = 0
      for (let i = 0; i < this.formData.decks.length; i++) {
        if (value === this.formData.decks[i].deckType) {
          this.typeCount += 1
        }
      }
      if (this.typeCount >= 2) {
        this.typeCount = 0
        return true
      }
    },
    removeDeck (item) {
      const index = this.formData.decks.indexOf(item)
      if (index !== -1) {
        this.formData.decks.splice(index, 1)
      }
    },
    addDeck () {
      this.formData.decks.push({
        deckType: '',
        deckNum: 1,
        key: Date.now()
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.option.series[0].data.length = 0

          this.formData.decks.forEach(item => {
            const obj = {
              name: item.deckType,
              value: item.deckNum,
              key: Date.now()
            }
            this.option.series[0].data.push(obj)
          })

          this.sortDecks()
          this.dialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sortDecks () {
      const decks = this.option.series[0].data
      decks.sort((a, b) => {
        return b.value - a.value
      })

      for (let i = 0; i < decks.length; i++) {
        if (decks[i].name === 'Others') {
          const othersItem = this.option.series[0].data.splice(i, 1)
          this.option.series[0].data.push(othersItem[0])
          return
        }
      }
    },
    sortSelectOptions () {
      this.deckOptions.sort((a, b) => {
        return a.value.localeCompare(b.value)
      })

      for (let i = 0; i < this.deckOptions.length; i++) {
        if (this.deckOptions[i].value === 'Others') {
          const othersItem = this.deckOptions.splice(i, 1)
          this.deckOptions.unshift(othersItem[0])
          return
        }
      }
    },
    preview () {
      this.picDialogVisible = true
      this.$nextTick(() => {
        const node = document.getElementById('pic-node')
        const result = document.getElementById('pic-result')
        result.innerHTML = ''
        domtoimage.toPng(node).then(function (dataUrl) {
          const img = new Image()
          img.src = dataUrl
          result.appendChild(img)
        }).catch(function (error) {
          console.error('oops, something went wrong!', error)
        })
      })
    },
    savePic () {
      domtoimage.toBlob(document.getElementById('pic-node')).then(function (blob) {
        saveAs(blob, 'pie.png')
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&display=swap');

.pie {
  min-height: 800px;
  position: relative;
  background: url(../../public/background.jpg);
}

.chart {
  width: 900px;
  height: 650px;
  position: absolute;
  top: 90px;
  left: 400px;
}

#pic-node {
  min-width: 1500px;
  min-height: 800px;
  background: url(../../public/background.jpg);
}

.bounce-btn {
  width: 140px;
  height: 60px;
  line-height: 60px;
  background: #66cbff;
  color: #fafafa;
  display: block;
  text-decoration: none;
  border-radius: 0.5em;
  letter-spacing: 0.08em;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Source Sans Pro', sans-serif;
  -webkit-box-shadow: 0 0.75em 0 #63a7ee, 0 1.25em 0 0.35em #c9e8e3;
  box-shadow: 0 0.75em 0 #63a7ee, 0 1.25em 0 0.35em #c9e8e3;
  text-align: center;
  position: absolute;
  top: 30px;
  right: 50px;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  cursor: pointer;
  user-select: none;
}

.bounce-btn:hover,
.bounce-btn:focus {
  -webkit-transition: all 0.25s;
  transition: all 0.25s;
  background: #fafafa;
  color: #66cbff;
  -webkit-box-shadow: 0 0.75em 0 #c2c2c2, 0 1.25em 0 0.35em #c9e8e3;
  box-shadow: 0 0.75em 0 #c2c2c2, 0 1.25em 0 0.35em #c9e8e3;
}

.bounce-btn:active {
  -webkit-box-shadow: 0 0 0 0.35em #c9e8e3;
  box-shadow: 0 0 0 0.35em #c9e8e3;
  -webkit-transform: translate(0, 1.25em);
  transform: translate(0, 1.25em);
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
}

.save-btn {
  width: 140px;
  height: 60px;
  line-height: 60px;
  background: #a6c198;
  color: #fafafa;
  display: block;
  text-decoration: none;
  border-radius: 0.5em;
  letter-spacing: 0.08em;
  font-size: 20px;
  font-weight: 600;
  font-family: 'Source Sans Pro', sans-serif;
  -webkit-box-shadow: 0 0.75em 0 #5b8767, 0 1.25em 0 0.35em #c9e8e3;
  box-shadow: 0 0.75em 0 #5b8767, 0 1.25em 0 0.35em #c9e8e3;
  text-align: center;
  position: absolute;
  top: 180px;
  right: 50px;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  cursor: pointer;
  user-select: none;
}

.save-btn:hover,
.save-btn:focus {
  -webkit-transition: all 0.25s;
  transition: all 0.25s;
  background: #fafafa;
  color: #a6c198;
  -webkit-box-shadow: 0 0.75em 0 #c2c2c2, 0 1.25em 0 0.35em #c9e8e3;
  box-shadow: 0 0.75em 0 #c2c2c2, 0 1.25em 0 0.35em #c9e8e3;
}

.save-btn:active {
  -webkit-box-shadow: 0 0 0 0.35em #c9e8e3;
  box-shadow: 0 0 0 0.35em #c9e8e3;
  -webkit-transform: translate(0, 1.25em);
  transform: translate(0, 1.25em);
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
}

.info {
  padding: 20px 0 10px 20px;
}

.info-title {
  font-size: 50px;
  margin-bottom: 16px;
  color: #f7dd41;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
}

.sub-title {
  display: inline-block;
  font-size: 30px;
  margin-bottom: 16px;
  color: #e9f1f6;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
}

.decks {
  min-width: 100px;
}

.deck-item {
  min-width: 100px;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  margin-bottom: 3px;
  color: #f8e58c;
  font-family: 'Noto Sans SC', sans-serif;
  font-weight: 600;
}

.deck-num {
  display: inline-block;
  width: 40px;
  color: #e9f1f6;
}

.deck-input {
  width: 50%;
}

.btn-box {
  margin-top: 40px;
}

.btn-right {
  float: right;
}

.pic-dialog >>> .el-dialog__body #pic-result img {
  width: 100%;
}

.pie-dialog >>> .el-dialog__title {
  font-size: 30px;
  font-weight: 600;
  color: #5b8767;
  text-shadow: 1px 0px 1px #ccc, 0px 1px 1px #eee, 2px 1px 1px #ccc,
    1px 2px 1px #eee, 3px 2px 1px #ccc, 2px 3px 1px #eee, 4px 3px 1px #ccc,
    3px 4px 1px #eee, 5px 4px 1px #ccc, 4px 5px 1px #eee, 6px 5px 1px #ccc,
    5px 6px 1px #eee, 7px 6px 1px #ccc;
}

.pic-dialog >>> .el-dialog__title {
  font-size: 30px;
  font-weight: 600;
  color: #5b8767;
  text-shadow: 1px 0px 1px #ccc, 0px 1px 1px #eee, 2px 1px 1px #ccc,
    1px 2px 1px #eee, 3px 2px 1px #ccc, 2px 3px 1px #eee, 4px 3px 1px #ccc,
    3px 4px 1px #eee, 5px 4px 1px #ccc, 4px 5px 1px #eee, 6px 5px 1px #ccc,
    5px 6px 1px #eee, 7px 6px 1px #ccc;
}

.pie-dialog >>> .el-form-item__content {
  margin-left: 130px !important;
}

.pie-form >>> .el-input {
  margin-right: 5% !important;
}

.deck-list >>> .el-form-item {
  display: inline-block;
}
</style>
