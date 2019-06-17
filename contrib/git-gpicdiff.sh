#!/bin/sh

hash1=`echo ${3} | cut -c 1-7`
hash2=`echo ${6} | cut -c 1-7`

gpicdiff --label-path1=${1}:${hash1} --label-path2=${1}:${hash2} $2 $5
