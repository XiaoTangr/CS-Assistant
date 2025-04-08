<template>
    <h1>
        {{ count2 }}
    </h1>
    <button @click="count++">Count is: {{ count }}</button>
    <button @click="addcount">{{ count2 }}</button>
</template>
<script>

export default {

    data() {
        return {
            count: 0,
            count2: 0
        }
    },

    methods: {
        addcount() {
            this.count2 += 1;
            prompt("sometext", "defaultText");
            confirm("sometext");
            alert('Button clicked');
        },
        decrement() {
            if (this.count > 0) {
                this.count--;
            }
        }
    }
}
</script>

<style scoped>
button {
    font-weight: bold;
}
</style>