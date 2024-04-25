#!/bin/bash
export MHA_LIBRARY_PATH=../../../openMHA-master/lib
export PATH=../../../openMHA-master/bin:$PATH
source ../../../openMHA-master/bin/thismha.sh


echo "Source path: $1"
echo "Dest path: $2"
echo "User Gain Table: $3"
echo "FilterA: $4"
echo "FilterB: $5"
echo "FilterC: $6"
echo "Latency: $7"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FILTERA_CFG="$SCRIPT_DIR/FilterA.cfg"
FILTERB_CFG="$SCRIPT_DIR/FilterB.cfg"
FILTERC_CFG="$SCRIPT_DIR/FilterC.cfg"
USERGAIN_CFG="$SCRIPT_DIR/UserGain.cfg"

# Create the directory if it doesn't exist
mkdir -p "$2"

# APPLY USER GAIN
for file in "$1"/*.wav
do
	echo $file
	fnameout_HApath1="$2/HApath1_$(basename "$file")"
	fnameout_HApath2="$2/HApath2_$(basename "$file")"
	fnameout_Directpath1="$2/Directpath1_$(basename "$file")"
	fnameout_Directpath2="$2/Directpath2_$(basename "$file")"
	fnameout_Combinedpath="$2/Combined_$7_$(basename "$file")"
	echo $fnameout_HApath
	echo $fnameout_Directpath
	echo $fnameout_Combinedpath

	mha ?read:$USERGAIN_CFG mha.overlapadd.smoothgains_bridge.mhachain.dc.gtdata="$3" io.in="$file" io.out="$fnameout_HApath1" cmd=start cmd=quit
	mha ?read:$FILTERB_CFG mha.overlapadd.smoothgains_bridge.mhachain.dc.gtdata="$5" io.in="$fnameout_HApath1" io.out="$fnameout_HApath2" cmd=start cmd=quit

	mha ?read:$FILTERA_CFG mha.overlapadd.smoothgains_bridge.mhachain.dc.gtdata="$4" io.in="$file" io.out="$fnameout_Directpath1" cmd=start cmd=quit
	mha ?read:$FILTERC_CFG mha.overlapadd.smoothgains_bridge.mhachain.dc.gtdata="$6" io.in="$fnameout_Directpath1" io.out="$fnameout_Directpath2" cmd=start cmd=quit
	python assets/MHAconfigs/add_latency.py $fnameout_HApath2 $fnameout_Directpath2 $fnameout_Combinedpath $7
done


#./Run_all.sh /Users/yumnaanwar/Desktop/filter_denoiser_user_study/server/assets/stimulisentences /Users/yumnaanwar/Desktop/filter_denoiser_user_study/server/assets/stimulisentences_usertest '[[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0]]' '[[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0]]' '[[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0]]' '[[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0];[0 0]]' 10
