library ieee;
use ieee.STD_LOGIC_1164.all;


entity encod_4_16 is 
	port (
		input : in std_logic_vector(15 downto 0) := (others => '0');
		output : out std_logic_vector(3 downto 0) := (others => '0')
	);
end encod_4_16;


architecture Behavioral of encod_4_16 is

begin
	process(input)

	begin
		case input is
			when "0000000000000001" => output <= "0000";
			when "0000000000000010" => output <= "0001";
			when "0000000000000100" => output <= "0010";
			when "0000000000001000" => output <= "0011";
			when "0000000000010000" => output <= "0100";
			when "0000000000100000" => output <= "0101";
			when "0000000001000000" => output <= "0110";
			when "0000000010000000" => output <= "0111";
			when "0000000100000000" => output <= "1000";
			when "0000001000000000" => output <= "1001";
			when "0000010000000000" => output <= "1010";
			when "0000100000000000" => output <= "1011";
			when "0001000000000000" => output <= "1100";
			when "0010000000000000" => output <= "1101";
			when "0100000000000000" => output <= "1110";
			when "1000000000000000" => output <= "1111";
			when others => output <= (others => '0');
		end case;		

	end process;


end Behavioral; 	
