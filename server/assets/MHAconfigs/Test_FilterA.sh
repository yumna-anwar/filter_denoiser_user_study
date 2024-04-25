#!/bin/bash
export MHA_LIBRARY_PATH=../../../openMHA-master/lib
export PATH=../../../openMHA-master/bin:$PATH
source ../../../openMHA-master/bin/thismha.sh


echo "Source file: $1"
echo "dest file: $2"
echo "Gain Table: $3"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILTERA_CFG="$SCRIPT_DIR/FilterA.cfg"


mha ?read:$FILTERA_CFG mha.overlapadd.smoothgains_bridge.mhachain.dc.gtdata="$3" io.in="$1" io.out="$2" cmd=start cmd=quit

#./run_FilterA.sh  audios/ISTS_V10_60s_24bit.wav ./ISTS_V10_60s_24bit.wav '[[-25 -25 -25 -25 ];[-15 -15 -15 -15 ];[-2 -2 -2 -2 ];[2 2 2 2 ];[2 2 2 2 ];[1 1 1 1 ];[0 0 0 0 ];[0 0 0 0 ];[-25 -25 -25 -25 ];[-15 -15 -15 -15 ];[-2 -2 -2 -2 ];[2 2 2 2 ];[2 2 2 2 ];[1 1 1 1 ];[0 0 0 0 ];[0 0 0 0 ]]’
