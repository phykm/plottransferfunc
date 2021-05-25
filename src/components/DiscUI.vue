<template>
	<div>
		<svg v-on:click="onAreaClick" x=0 y=0 v-bind:width="size" v-bind:height="size" v-bind:style="`background-color:`+bgcolor" >
			<circle v-bind:cx="size/2" v-bind:cy="size/2" v-bind:r="size/2"  stroke="black" stroke-width="1" fill="none"/>
			<line v-bind:x1="size/2" v-bind:y1="0" v-bind:x2="size/2" v-bind:y2="size"  stroke="black" stroke-width="1"/>
			<line v-bind:x1="0" v-bind:y1="size/2" v-bind:x2="size" v-bind:y2="size/2"  stroke="black" stroke-width="1"/>
			<circle v-for="(pt, index) in points" v-bind:key="index" v-bind:cx="vToPos(pt).x" v-bind:cy="vToPos(pt).y" v-bind:r="1" stroke="green" stroke-width="2" fill="none"/>
		</svg>
	</div>
</template>

<script>
// DiscUIは、描画サイズと、描画すべき点をpropとして受ける。
// v-on:areaClickで、円盤上の点が帰ってくるので、これを使ってハンドルする。
export default {
	name: 'DiscUI',
    props: {
		id: Number,
		bgcolor: String,
        size:Number,
		points: {type:Array}
    },
	methods: {
		onAreaClick(event) {
			// eventはこのUIに与えられたidと座標値を渡す。
			let v = this.posToV({x:event.offsetX,y:event.offsetY})
			v.id = this.id
			console.log(v)
			this.$emit("areaClick",v)
		},
		vToPos(pts) {
			return {
				x: (pts.x+1)*(this.size/2),
				y: (1-pts.y)*(this.size/2)
			}
		},
		posToV(pos) {
			return {
				x: (pos.x/(this.size/2))-1,
				y: 1-(pos.y/(this.size/2))
			}
		}
	}
}
</script>