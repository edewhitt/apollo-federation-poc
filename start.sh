#!/usr/bin/env bash
set -e

red_f="31"

function print-color-line {
    printf "\e[$1m$2\n\e[0m"
}

function print-error-line {
    print-color-line $red_f "$1"
}

function check_option {
  local currentdir=$(pwd)

  appointments_cmd="cd ${currentdir}/services/appointments && npm start"
  gateway_cmd="cd ${currentdir} && npm start"
  providers_cmd="cd ${currentdir}/services/providers && python3 -m venv .env && source .env/bin/activate && pip install -r requirements.txt && python3 app.py"
  users_cmd="cd ${currentdir}/services/users && npm start"

  for option in "$@"; do
    case $option in
    "Start Gateway")
        run_command_in_new_window "$gateway_cmd"
        ;;
    "Start All Services")
        run_command_in_new_window "$appointments_cmd"
        run_command_in_new_window "$providers_cmd"
        run_command_in_new_window "$users_cmd"
        ;;
    "Start Appointments")
        run_command_in_new_window "$appointments_cmd"
        ;;
    "Start Providers")
        run_command_in_new_window "$providers_cmd"
        ;;
    "Start Users")
        run_command_in_new_window "$users_cmd"
        ;;
      *)
        print-error-line "Unrecognized command name: $option"
        return
        ;;
    esac
  done
}

function run_command_in_new_window {
    printf "$1"
    osascript -e "tell app \"Terminal\" to do script \"$1\"" >> /dev/null
}


if [ -n "${1-}" ]; then
  echo "Executing $1 ..."
  check_option "$1"
else
  PS3="Please enter your choice: "
  options=("Start Gateway" "Start All Services" "Start Appointments" "Start Providers" "Start Users" "Exit")
  select opt in "${options[@]}"
  do
    check_option "$opt"
    break
  done
fi