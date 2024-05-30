if ! test -e clicker-chaos; then
    printf "\nFAILURE: The clicker chaos project could not be accessed on GitHub. Try cloning the repository again with the `git clone` command"
else
    #clicker-chaos
    cd clicker-chaos
    rm -rf .git* .main
    rm -rf README.md
    cd ../..
fi