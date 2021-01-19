input=".env"

while IFS= read -r line
do
  export $(eval \"$(echo $line | cut -d "=" -f 1)\")=$(echo $line | cut -d "=" -f 2)"
done < "$input"