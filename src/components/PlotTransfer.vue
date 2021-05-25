<template>
  <div class="hello">
    <h1>DigitalFilter</h1>
    <h1>TransferFunctionPlotter</h1>
    <div style="padding:5px;">
      <label for="samplingRate" style="padding:5px;">SamplingRate(Hz)</label>
      <input id="samplingRate" v-model="samplingRate" inputmode="numeric" style="text-align:right;">
    </div>
    
    <div style="padding:5px;">
      <button v-on:click="addZero" style="display:block;">Add Zero</button>
      <div style="display:flex;">
        <div v-for="(v,index) in zeroStatus" v-bind:key="index" style="display:inline;padding:5px;">
          <DiscWithButtons 
            :id="index" 
            :size="200" 
            :points="v.points"
            :bgcolor="`azure`" 
            :onReal="v.onReal"
            :samplingRate="samplingRate" 
            v-on:checked="checkedZero"
            v-on:areaClick="areaClickZero"
            v-on:deleteClick="deleteClickZero"
            v-on:inputDirectly="areaClickZero"
          />
        </div>
      </div>
    </div>

    <div style="padding:5px;">
      <button v-on:click="addPole" style="display:block;">Add Pole</button>
      <div style="display:flex;">
        <div v-for="(v,index) in poleStatus" v-bind:key="index" style="display:inline;padding:5px;">
          <DiscWithButtons 
            :id="index" 
            :size="200" 
            :points="v.points"
            :bgcolor="`mistyrose`" 
            :onReal="v.onReal"
            :samplingRate="samplingRate" 
            v-on:checked="checkedPole"
            v-on:areaClick="areaClickPole"
            v-on:deleteClick="deleteClickPole"
            v-on:inputDirectly="areaClickPole"
          />
        </div>
      </div>
    </div>
    <div style="padding:5px;">
      <div style="display:inline;padding:5px;">
        <button v-on:click="plot(true)">Plot!</button>
        <button v-on:click="plot(false)">Plot(Linear)!</button>
      </div>
      
      <div id="plotGain"/>
      <div id="plotPhase"/>
    </div>
  </div>
</template>

<script>
import DiscWithButtons from "./DiscWithButtons.vue"
import Calc from "../js/calculateTransfer.js"
import { complex, log10, abs, arg} from "mathjs"
import Plotly from "plotly.js-dist"
export default {
  name: 'PlotTransfer',
  props: {
    msg: String,
  },
  data: function(){
    return {
      // これに基づいて周波数特性を計算する。
      samplingRate: 44100,
      // {onReal:Bool,points: [{x:Number,y:Number}]} の配列
      zeroStatus: [], 
      poleStatus: [],
    }
  },
  components: {
    DiscWithButtons
  },
  methods: {
    // 以下zeroのイベントハンドリング
    addZero: function(){
      this.zeroStatus.push({points:[{x:0,y:0},{x:0,y:0}],onReal:false})
    },
    checkedZero: function(ev){
      let status = this.zeroStatus[ev.id]
      status.onReal=ev.onReal
      if (status.points.legnth === 0) {
        return
      }
      let pt = status.points[0]
      if (ev.onReal) {
        status.points = [{x:pt.x,y:0}]
      } else {
        status.points = [{x:pt.x,y:0},{x:pt.x,y:0}]
      }
    },
    areaClickZero: function(pt){
      let status = this.zeroStatus[pt.id]
      if (status.onReal) {
        status.points = [{x:pt.x,y:0}]
      } else {
        status.points = [{x:pt.x,y:pt.y},{x:pt.x,y:-pt.y}]
      }
    },
    deleteClickZero: function(key){
      this.zeroStatus.splice(key,1)
    },
    // 以下poleのイベントハンドリング
    addPole: function(){
      this.poleStatus.push({points:[{x:0,y:0},{x:0,y:0}],onReal:false})
    },
    checkedPole: function(ev){
      let status = this.poleStatus[ev.id]
      status.onReal=ev.onReal
      if (status.points.length == 0) {
        return
      }
      let pt = status.points[0]
      if (ev.onReal) {
        status.points = [{x:pt.x,y:0}]
      } else {
        status.points = [{x:pt.x,y:0},{x:pt.x,y:0}]
      }
    },
    areaClickPole: function(pt){
      let status = this.poleStatus[pt.id]
      if (status.onReal) {
        status.points = [{x:pt.x,y:0}]
      } else {
        status.points = [{x:pt.x,y:pt.y},{x:pt.x,y:-pt.y}]
      }
    },
    deleteClickPole: function(id) {
      this.poleStatus.splice(id,1)
    },
    plot: function(logarithmic){
      let num = Calc.arrageToComplexes(this.zeroStatus)
      let den = Calc.arrageToComplexes(this.poleStatus)
      let resp = Calc.frequencyResponseOfRationalTransferFunction(num,den,this.samplingRate)
      
      let xGain = []
      let yGain = []
      let xPhase = []
      let yPhase = []

      if (logarithmic) {
        let f = 1
        let dlogf = 1.05 // 対数微分
        // ナイキスト周波数まででOK
        for (let i = 0 ; f< this.samplingRate/2 ; i++) {
          f = f*dlogf
          xGain.push(f)
          xPhase.push(f)
          let g = resp(f)
          let db = log10(abs(g))*20
          yGain.push(db)
          let arg = g.arg()
          yPhase.push(arg)
        }
      } else {
        let f = 0
        let df = 20 // 微分
        for (let i = 0 ; f< this.samplingRate/2 ; i++) {
          f = f+df
          xGain.push(f)
          xPhase.push(f)
          let g = resp(f)
          let db = log10(abs(g))*20
          yGain.push(db)
          let arg = g.arg()
          yPhase.push(arg)
        }
      }

      var traceGain = {
        x: xGain,
        y: yGain,
        type: 'scatter'
      }
      var tracePhase = {
        x: xPhase,
        y: yPhase,
        type: 'scatter'
      }
      var dataGain = [traceGain]
      var dataPhase = [tracePhase]
      var layout = {
        xaxis: {
          type: logarithmic ? 'log' : 'linear',
          autorange: true
        },
        yaxis: {
          autorange: true
        }
      }
      Plotly.newPlot('plotGain', dataGain, layout)
      Plotly.newPlot('plotPhase', dataPhase, layout)
    }
  },
  computed: {
    hoge: function(){
      return this.input+this.$props.msg;
    }
  }
}
</script>
<style scoped>
div {
  margin:0px;
  padding:0px;
  text-align:left;
}
h1 {
  font-size:45pt;
  font-weight: bold;
  letter-spacing: -5px;
  color: #62d887;
  margin:0px;
}
</style>
