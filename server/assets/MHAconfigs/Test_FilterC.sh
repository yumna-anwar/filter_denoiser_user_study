#!/bin/bash
export MHA_LIBRARY_PATH=/Users/yumnaanwar/Desktop/Audio_Denoiser/openMHA-master/lib
export PATH=/Users/yumnaanwar/Desktop/Audio_Denoiser/openMHA-master/bin:$PATH
source /Users/yumnaanwar/Desktop/Audio_Denoiser/openMHA-master/bin/thismha.sh


echo "Source file: $1"
echo "dest file: $2"
echo "Gain Table: $3"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILTERA_CFG="$SCRIPT_DIR/FilterC.cfg"


mha ?read:$FILTERA_CFG mha.overlapadd.mhachain.dc.gtdata="$3" io.in="$1" io.out="$2" cmd=start cmd=quit

#./run_FilterA.sh  audios/ISTS_V10_60s_24bit.wav ./ISTS_V10_60s_24bit.wav '[[-25 -25 -25 -25 ];[-15 -15 -15 -15 ];[-2 -2 -2 -2 ];[2 2 2 2 ];[2 2 2 2 ];[1 1 1 1 ];[0 0 0 0 ];[0 0 0 0 ];[-25 -25 -25 -25 ];[-15 -15 -15 -15 ];[-2 -2 -2 -2 ];[2 2 2 2 ];[2 2 2 2 ];[1 1 1 1 ];[0 0 0 0 ];[0 0 0 0 ]]’