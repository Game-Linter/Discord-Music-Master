for file in $(find ./src -name "*.ts")
    do
        cat /mnt/c/Users/Quasimodo/Desktop/discord-music/copy.txt $file > $file.new && mv $file.new $file
    done