#!/bin/bash
# Kullanım: sheet.sh <anim.html> <çıktı.jpg> t1,t2,...  (7'li sıralar halinde temas sayfası)
S=/tmp/claude-0/-home-user-misafircheck/0cc9dfb7-332d-5180-bd04-65c7568bfc09/scratchpad; FF=$(cat $S/ffpath); D=$S/sheet_tmp; rm -rf $D
node "$(dirname $0)/render.js" "$1" stills $D "$3" || exit 1
files=($(ls $D/*.jpg)); n=${#files[@]}; cols=7; rows=$(( (n+cols-1)/cols ))
inputs=""; fc=""; lay=""
for i in "${!files[@]}"; do inputs="$inputs -i ${files[$i]}"; fc="$fc[$i]scale=300:533[v$i];"; lay="$lay$(( (i%cols)*300 ))_$(( (i/cols)*533 ))|"; done
for i in $(seq 0 $((n-1))); do fc="$fc[v$i]"; done
$FF -y -loglevel error $inputs -filter_complex "${fc}xstack=inputs=$n:layout=${lay%|}:fill=black" "$2"
