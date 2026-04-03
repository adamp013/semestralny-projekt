<script setup>
import { ref } from 'vue'


</script>

<template>
    <div class="min-h-screen bg-[#fbf6e8] flex ">

        <aside class="w-[240px] min-h-screen bg-[#eadfcc] flex flex-col py-8 px-4 border-r border-[#d9ceb9]">

            <!-- Cast Logo-->
            <div class="flex items-center justify-center gap-3 mb-10 w-full">
                <div class="w-10 h-10 bg-[#ff8c42] rounded-full opacity-80 shrink-0"></div>
                <h1 class="text-2xl font-bold text-orange-600">Logo</h1>
            </div>
            <!-- Cast navigacie-->
            <div class="flex justify-around items-end mb-6 w-full px-2">
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <span class="text-2xl hover:scale-110 transition-transform duration-200">🏠</span>
                    <span class="text-[10px] uppercase font-bold text-text opacity-60 group-hover:opacity-100">Home</span>
                </div>
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <span class="text-2xl hover:scale-110 transition-transform duration-200">📝</span>
                    <span class="text-[10px] uppercase font-bold text-text opacity-60 group-hover:opacity-100">New</span>
                </div>
                <div class="flex flex-col items-center gap-1 cursor-pointer group">
                    <span class="text-2xl hover:scale-110 transition-transform duration-200">📌</span>
                    <span class="text-[10px] uppercase font-bold text-text opacity-60 group-hover:opacity-100">Pins</span>
                </div>
            </div>

            <hr class="border-2 border-secondary opacity-20 mb-10 mx-2" />

            <!-- Cast Playlistov-->
            <div class="flex flex-col gap-10 overflow-y-auto items-center w-full p-4">
                <div class="flex flex-col items-center w-[140px]">
                    <div class="w-[120px] h-[120px] bg-secondary rounded-xl cursor-pointer hover:shadow-2xl transition-all hover:scale-105 duration-300"></div>
                    <span class="text-[13px] mt-3 text-secondary">Playlist 1</span>
                </div>

                <div class="flex flex-col items-center w-[140px]">
                    <div class="w-[120px] h-[120px] bg-[var(--color-primary)] rounded-xl cursor-pointer hover:shadow-2xl transition-all hover:scale-105 duration-300"></div>
                    <span class="text-[13px] mt-3 font-bold text-[var(--color-accent)] leading-tight">Playlist 2 (aktivny)</span>
                </div>

                <div class="flex flex-col items-center w-[140px]">
                    <div class="w-[120px] h-[120px] bg-secondary rounded-xl cursor-pointer hover:shadow-2xl transition-all hover:scale-105 duration-300"></div>
                    <span class="text-[13px] mt-3 text-secondary">Playlist 3</span>
                </div>
            </div>
        </aside>

        <!--Cast Header-->
        <aside class=" min-w-screen h-[100px] bg-[#faf3e0] flex flex-row items-center py-8 px-4 border-r shadow-lg">
            
            <div class="w-[440px] h-[52px] bg-[#ffffff] rounded-4xl cursor-pointer hover:shadow-2xl transition-all border border-secondary"></div>
            
            <div class="flex-row justify-items-end">
                <hr class="w-1 h-8 bg-[#d9ceb9] mx-6" />
            </div>

            
        </aside>
    </div>
</template>
