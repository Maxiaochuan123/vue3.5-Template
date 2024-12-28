<template>
	<div class="item">
		<div class="info">
			<div class="name">
				{{ name }}
				<slot name="suffix"></slot>
			</div>
			<div class="value">
				{{ isMoneyFormat ? '￥' : '' }}{{ formattedValue }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, watch, onUnmounted } from 'vue'
	import { useThemeVars } from 'naive-ui'

	const themeVars = useThemeVars()

	const props = defineProps<{
			icon?: string
			value: number | string
			name: string
			isMoneyFormat?: boolean
	}>()

	const displayValue = ref(0)
	let animationFrame: number

	const formatNumber = (num: number) => {
		const decimals = props.isMoneyFormat ? 2 : 0
		return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	const formattedValue = ref(formatNumber(0))

	const animate = (start: number, end: number, duration: number = 300) => {
		const startTime = performance.now()
		
		const updateNumber = (currentTime: number) => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)
			
			const currentValue = start + (end - start) * progress
			displayValue.value = currentValue
			formattedValue.value = formatNumber(currentValue)

			if (progress < 1) {
				animationFrame = requestAnimationFrame(updateNumber)
			}
		}

		cancelAnimationFrame(animationFrame)
		animationFrame = requestAnimationFrame(updateNumber)
	}

	watch(() => props.value, (newVal) => {
		const endValue = Number(newVal) || 0
		animate(displayValue.value, endValue)
	}, { immediate: true })

	onUnmounted(() => {
		cancelAnimationFrame(animationFrame)
	})
</script>

<style lang="less" scoped>
	.item {
		flex: 1;
		min-width: calc(50% - 10px);
		display: flex;
		align-items: center;

		.info {
			display: flex;
			flex-direction: column;
			width: 100%;

			.name {
				font-size: 16px;
				color: #606266;
				margin-bottom: 8px;
				display: flex;
				align-items: center;
			}

			.value {
				font-size: 24px;
				font-weight: 500;
				color: v-bind('themeVars.primaryColor');
			}
		}
	}
</style>
