<template>
	<div>
		<div style="display:inline;">
            <button v-on:click="onDeleteClick(id)">Delete</button>
            <button v-on:click="onToggle(!onReal)">{{ onReal ? "Real" : "Conjugate"}}</button>
        </div>
        <DiscUI :id="id" :size="size" :points="points" v-on:areaClick="onAreaClick" :bgcolor="bgcolor"/>
        <div v-if="!onReal">
            <div> r= {{radius}} </div>
            <div> f= {{freq}} </div>
            <div>
                r: 
                <input v-model="formRadius" inputmode="numeric" style="text-align:right;width:100px;">
            </div>
            <div>
                f: 
                <input v-model="formFreq" inputmode="numeric" style="text-align:right;width:100px;">
            </div>
            <button v-on:click="onInputDirectly">Set Manually</button>
        </div>
	</div>
</template>

<script>
import DiscUI from "./DiscUI.vue"
import {complex, isNumeric} from "mathjs"
export default {
    name: "DiscWithButtons",
    components: {
        DiscUI
    },
    props: {
        // 基本すべてをpropとしてトップから与えるようにする
        id: Number,
        size: Number,
        bgcolor: String,
        points: {type:Array},
        samplingRate: Number,
        onReal: Boolean
    },
    data: function(){
        return {
            formRadius : null,
            formFreq : null
        }
    },
    methods: {
        // 削除操作ハンドリングのため、idを上げる
        onDeleteClick: function(id){
            this.$emit("deleteClick",id)
        },
        // そのまま親にあげる。
        onAreaClick: function(pt){
            // pt は idも持っている。
            this.$emit("areaClick",pt)
        },
        // idと次の状態を上げる。onReal値
        onToggle: function(nextState) {
            let ev = {onReal:nextState,id:this.id}
            this.$emit("checked",ev)
        },
        onInputDirectly: function(){
            let arg =(this.formFreq/this.samplingRate)*2*Math.PI
            let c = complex({abs:Number(this.formRadius),arg:arg})
            let pt = {id:this.id,x:c.re,y:c.im}
            this.$emit("inputDirectly",pt)
        }
    },
    computed: {
        radius: function(){
            let x = this.points[0].x
            let y = this.points[0].y
            return Math.sqrt(x*x + y*y)
        },
        arg: function(){
            let x = this.points[0].x
            let y = this.points[0].y
            return complex({re:x,im:y}).arg()
        },
        freq: function(){
            return Math.abs(this.arg*this.samplingRate)/(2*Math.PI)
        }
    }
}
</script>