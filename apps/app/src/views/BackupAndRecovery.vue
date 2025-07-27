<template>
    <div>
        <GlassCard class="container">
            1
        </GlassCard>

        <GlassCard shadow="hover" class="container">
            1
        </GlassCard>
        <GlassCard shadow="never" class="container">
            1
        </GlassCard>
    </div>
</template>

<script setup lang="ts">
import GlassCard from '@/components/Common/GlassCard.vue';


</script>

<style lang="scss" scoped>
.container {
    margin: 2em;
}
</style>